package main

import (
	"embed"
	"log"
	"strings"

	// "encoding/json"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"github.com/glebarez/sqlite"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/template/html/v2"
)

type (
	Difficulty int
	Score      struct {
		gorm.Model
		Name       string     `json:"name" validate:"required,min=1,max=20"`
		Score      int        `json:"score"`
		Time       int        `json:"time"`
		Difficulty Difficulty `json:"difficulty" validate:"required"`
	}

	ErrorResponse struct {
		Error       bool
		FailedField string
		Tag         string
		Value       interface{}
	}

	XValidator struct {
		validator *validator.Validate
	}

	GlobalErrorHandlerResp struct {
		Success bool   `json:"success"`
		Message string `json:"message"`
	}
)

//go:embed web/*
var webfs embed.FS

func main() {
	engine := html.New("./views", ".html")
	db, err := Connect("./fiber.sql")
	if err != nil {
		panic(err)
	}
	app := fiber.New(fiber.Config{
		Views: engine,
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			return c.Status(fiber.StatusBadRequest).JSON(GlobalErrorHandlerResp{
				Success: false,
				Message: err.Error(),
			})
		},
	})
	app.Static("/", "./web")

	api := app.Group("/api")
	v1 := api.Group("/v1", func(c *fiber.Ctx) error { // middleware for /api/v1
		c.Set("Version", "v1")
		return c.Next()
	})
	v1.Get("/new", FiberHandler(ScoreBoardForm, db))

	v1.Get("/scoreboard", FiberHandler(ShowScoreBoard, db))

	v1.Get("/form", FiberHandler(Form, db))

	// app.Listen(":3000")

	panic(app.Listen(":3000"))
}

// let rec quicksort = function
//	| [] -> []
//	| x::xs -> let smaller, larger = List.partition (fun y -> y < x) xs
//	           in quicksort smaller @ (x::quicksort larger)

func cmp(s, s2 Score) bool {
	return s.Score > s2.Score || (s.Score == s2.Score) && s.Time < s2.Time
}

func quicksort(i []Score) []Score {
	switch len(i) {
	case 0, 1:
		return i
	default:
		pivot := i[0]
		var left, right []Score

		for _, score := range i[1:] {
			if cmp(score, pivot) {
				left = append(left, score)
			} else {
				right = append(right, score)
			}
		}

		left = quicksort(left)
		right = quicksort(right)

		sorted := append(append(left, pivot), right...)
		return sorted
	}
}

// TODO remove duplicates

func difficulty_of_int(i int) (Difficulty, error) {
	switch i {
	case 1:
		return 1, nil
	case 2:
		return 2, nil
	case 3:
		return 3, nil
	default:
		return 0, fmt.Errorf("error invalid difficulty")
	}
}

// Params:
// name: string min=1 max=20 time=1000
func ScoreBoardForm(c *fiber.Ctx, db *gorm.DB) error {
	log.Printf("Leaderboard req: %v\n", c.String())
	difficulty, err := difficulty_of_int(c.QueryInt("difficulty"))
	if err != nil {
		return err
	}
	userScore := Score{
		Name:       c.Query("name"),
		Score:      c.QueryInt("score"),
		Time:       c.QueryInt("time"),
		Difficulty: difficulty,
	}

	myValidator := &XValidator{
		validator: validate,
	}
	// Validation
	if errs := myValidator.Validate(userScore); len(errs) > 0 && errs[0].Error {
		errMsgs := make([]string, 0)

		for _, err := range errs {
			errMsgs = append(errMsgs, fmt.Sprintf(
				"[%s]: '%v' | Needs to implement '%s'",
				err.FailedField,
				err.Value,
				err.Tag,
			))
		}

		return &fiber.Error{
			Code:    fiber.ErrBadRequest.Code,
			Message: strings.Join(errMsgs, " and "),
		}
	}

	db.Create(&userScore)
	fmt.Printf("%v", userScore)
	return c.SendString("aaaa")
}

func filter(i []Score, f func(Score) bool) []Score {
	switch len(i) {
	case 0:
		return []Score{}
	case 1:
		if f(i[0]) {
			return i
		} else {
			return []Score{}
		}

	default:
		h := i[0]
		t := i[1:]
		if f(h) {
			return append([]Score{h}, filter(t, f)...)
		} else {
			return filter(t, f)
		}
	}
}

func Form(c *fiber.Ctx, db *gorm.DB) error {
	return c.Render("form", fiber.Map{})
}

func max(a, b int) int {
	if a < b {
		return b
	}
	return a
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func ShowScoreBoard(c *fiber.Ctx, db *gorm.DB) error {
	var people []Score
	db.Find(&people)

	ff := func(p []Score) []Score {
		max := min(len(p), 10) // max index
		return quicksort(p)[0:max]
	}
	filt := func(i int) func(Score) bool {
		return func(s Score) bool {
			n, err := difficulty_of_int(i)
			if err != nil {
				panic("filter invalid difficulty")
			}
			return s.Difficulty == n
		}
	}

	people1 := filter(people, filt(1))
	people2 := filter(people, filt(2))
	people3 := filter(people, filt(3))

	log.Println(ff(people1))
	return c.Render("scoreboard", fiber.Map{
		"People1": ff(people1),
		"People2": ff(people2),
		"People3": ff(people3),
	})
}

func FiberHandler(fn func(*fiber.Ctx, *gorm.DB) error, db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return fn(c, db)
	}
}

func Connect(path string) (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open(path), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	db.AutoMigrate(Score{})
	return db, nil
}

var validate = validator.New()

func (v XValidator) Validate(data interface{}) []ErrorResponse {
	validationErrors := []ErrorResponse{}

	errs := validate.Struct(data)
	if errs != nil {
		for _, err := range errs.(validator.ValidationErrors) {
			// In this case data object is actually holding the User struct
			var elem ErrorResponse

			elem.FailedField = err.Field() // Export struct field name
			elem.Tag = err.Tag()           // Export struct tag
			elem.Value = err.Value()       // Export field value
			elem.Error = true

			validationErrors = append(validationErrors, elem)
		}
	}

	return validationErrors
}

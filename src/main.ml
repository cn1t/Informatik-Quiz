open Core
open Core.Result.Let_syntax

type scoreboard =
  | Easy
  | Moderate
  | Hard

let scoreboard_of_int i =
  match i with
  | 1 -> Ok Easy
  | 2 -> Ok Moderate
  | 3 -> Ok Hard
  | _ -> Error "bad magic"
;;

let string_of_scoreboard s =
  match s with
  | Easy -> "Easy"
  | Moderate -> "Moderate"
  | Hard -> "Hard"
;;

type score =
  { scoreboard : scoreboard
  ; score : int
  }

let score_of_form score scoreboard_int =
  let%bind scoreboard' = scoreboard_of_int scoreboard_int in
  Ok { score; scoreboard = scoreboard' }
;;

let string_of_score x = string_of_int x.score ^ "TODO" ^ string_of_scoreboard x.scoreboard

(* type s = { scoreboard : scoreboard } *)

(* let s_of_form (scoreboard_int : int) = *)
(*   let%bind scoreboard = scoreboard_of_int scoreboard_int in *)
(*   Ok { scoreboard : scoreboard } *)
(* ;; *)

let show_scoreboard score = Dream.html (Scoreboard.show (Some score))

(* TODO: add save to db func *)
let () =
  Dream.run
  @@ Dream.logger
  @@ Dream.router
       [ Dream.get "/**" (Dream.static ".")
       ; Dream.get "/**" (Dream.static ".")
       ; Dream.post "/api/v1/score" (fun request ->
           match%lwt Dream.form ~csrf:false request with
           | `Ok [ ("score", score); ("scoreboard", scoreboard_int) ] ->
             let s = score_of_form (int_of_string score) (int_of_string scoreboard_int) in
             let s' =
               match s with
               | Ok x -> x
               | Error _ -> failwith "error"
             in
             show_scoreboard (string_of_score s')
           | _ -> Dream.empty `Bad_Request)
       ]
;;

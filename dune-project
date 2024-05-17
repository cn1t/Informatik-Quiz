(lang dune 3.11)

(name informatikquizbiber)

(generate_opam_files true)

(source
 (github "cn1t/informatikquizbiber"))

(authors "cn1t")

(maintainers "cn1t")

(license LICENSE)

(documentation https://github.com/cn1t/informatikquizbiber)

(package
 (name informatikquizbiber)
 (synopsis "Simple ocaml template fro using nix flakes")
 (description "A longer description")
 (depends 
   dune
   (ocaml (>= "4.14.1"))
   ; jane street
   (core_kernel (>= 0.16.0))

   ; web
   (dream (>= "1.0.0~alpha5"))
   lwt_ppx
   ppx_deriving
   ; reason
   ; js_of_ocaml
  )
 (tags
  (topics "ocaml")))

; See the complete stanza docs at https://dune.readthedocs.io/en/stable/dune-files.html#dune-project

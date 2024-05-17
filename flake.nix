{
  description = "A simple Go package";

  # Nixpkgs / NixOS version to use.
  inputs = {
    nixpkgs = {
      url = "github:Nixos/nixpkgs/nixpkgs-unstable";
      flake = true;
    };
    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };
  };

  outputs = { self, nixpkgs, flake-compat }:
    let

      # to work with older version of flakes
      lastModifiedDate = self.lastModifiedDate or self.lastModified or "19700101";

      # Generate a user-friendly version number.
      version = builtins.substring 0 8 lastModifiedDate;

      # System types to support.
      supportedSystems = [ "x86_64-linux" "x86_64-darwin" "aarch64-linux" "aarch64-darwin" ];

      # Helper function to generate an attrset '{ x86_64-linux = f "x86_64-linux"; ... }'.
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;

      # Nixpkgs instantiated for supported system types.
      nixpkgsFor = forAllSystems (system: import nixpkgs { inherit system; });

    in
    {

      # Provide some binary packages for selected system types.
      packages = forAllSystems
        (system:
          let
            pkgs = nixpkgsFor.${system};
            # name = "InformatikQuiz";
            # appdir = "${name}.AppDir";
          in
          {


            fiber-web = pkgs.buildGoModule {
              #${pkgs.git}/bin/git init -q
              # postConfigure = ''
              #   ${pkgs.go}/bin/go generate ./...
              #   ${pkgs.nodePackages_latest.typescript}/bin/tsc --project web --watch false
              # '';
              pname = "fiber-web";
              inherit version;
              src = ./.;
              CGO_ENABLED = 0;
              tags = [
                "osusergo"
                "netgo"
                "static_build"
              ];
              ldflags = [
                "-s -w"
                "-extldflags=-static"
                #"-X main.version=${version}"
              ];
              vendorSha256 = "sha256-TfNg8k4P9s70pp0sK/Wpm2mbmSmZZVZcJgrHskPqjmU=";
            };
          });

      # apps = forAllSystems (system: {
      #   default = {
      #     type = "app";
      #     program = "${self.packages.${system}.informatikquizbiber}/bin/informatikquizbiber";
      #   };
      # });

      formatter = forAllSystems (system: nixpkgsFor.${system}.nixpkgs-fmt);

      devShells = forAllSystems (system: {
        default = nixpkgsFor.${system}.mkShell {
          packages = [
            nixpkgsFor.${system}.go
            nixpkgsFor.${system}.gcc
            # jq is useful to debug the database
            nixpkgsFor.${system}.jq
            nixpkgsFor.${system}.gh
            nixpkgsFor.${system}.goreleaser

            nixpkgsFor.${system}.gcc
          ];
        };
      });


      defaultPackage = forAllSystems (system: self.packages.${system}.fiber-web);
    };
}

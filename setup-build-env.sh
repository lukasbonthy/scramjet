#!/bin/bash

# Install Rust and cargo
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source $HOME/.cargo/env

# Install wasm-bindgen
cargo install wasm-bindgen-cli

# Install wasm-opt (Binaryen)
curl -L https://github.com/WebAssembly/binaryen/releases/download/version_113/binaryen-version_113-x86_64-linux.tar.gz | tar xz
sudo mv binaryen-version_113/* /usr/local/bin/

# Install wasm-snip
cargo install wasm-snip

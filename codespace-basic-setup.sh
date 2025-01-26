curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source $HOME/.cargo/env
export PATH="$HOME/.cargo/bin:/usr/local/bin:$PATH"

cargo install wasm-bindgen-cli
curl -L https://github.com/WebAssembly/binaryen/releases/download/version_113/binaryen-version_113-x86_64-linux.tar.gz | tar xz
mv binaryen-version_113/* $HOME/.local/bin/
export PATH="$HOME/.local/bin:$PATH"

cargo install wasm-snip

pnpm install --frozen-lockfile
pnpm rewriter:build

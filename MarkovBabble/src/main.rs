use markov_babble::{chain::MarkovChain, tokenizer::Encoding};

const CORPUS: &str = include_str!("./corpus.txt");

fn main() {
    let encoding = Encoding::new(CORPUS);
    let chain = MarkovChain::from_tokens(encoding.encode(CORPUS));

    let mut rng = rand::rng();
    let mut token = encoding.encode_single_exact("\n\n").unwrap() as u32;
    for _ in 0..5_000 {
        let next_token = chain.pick_next(&mut rng, token);
        print!("{}", encoding.decode_single(next_token).unwrap());
        token = next_token;
    }
}

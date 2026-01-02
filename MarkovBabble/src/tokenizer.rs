use std::{collections::BTreeMap, iter};

use itertools::Itertools;

const VOCAB_SIZE: usize = 1_000;

#[derive(Debug)]
pub struct Encoding {
    /// Sorted list of unique tokens
    vocab: Vec<String>,
}

impl Encoding {
    pub fn empty() -> Self {
        Self { vocab: Vec::new() }
    }

    /// Creates a modified byte-pair encoding
    pub fn new(corpus: &str) -> Self {
        assert!(!corpus.is_empty(), "corpus must not be empty");

        let mut encoding = Self::empty();
        for c in corpus.chars() {
            encoding.insert(c.to_string());
        }

        let mut pair_counts = BTreeMap::new();
        while encoding.len() < VOCAB_SIZE {
            pair_counts.clear();
            for (a, b) in encoding.encode(corpus).tuple_windows() {
                *pair_counts.entry((a, b)).or_insert(0u32) += 1;
            }
            let (&(a, b), _) = pair_counts.iter().max_by_key(|&(_, &count)| count).unwrap();

            let new_token =
                encoding.decode_single(a).unwrap().to_string() + encoding.decode_single(b).unwrap();
            let inserted = encoding.insert(new_token);
            assert!(
                inserted,
                "token already exists, but was somehow not found when searching for pairs"
            );
        }

        encoding
    }

    pub fn len(&self) -> usize {
        self.vocab.len()
    }

    fn insert(&mut self, token: String) -> bool {
        match self.vocab.binary_search(&token) {
            Ok(_) => false,
            Err(index) => {
                self.vocab.insert(index, token);
                true
            }
        }
    }

    pub fn encode_single_exact(&self, input: &str) -> Option<usize> {
        match self.vocab.binary_search(&input.to_string()) {
            Ok(index) => Some(index),
            Err(_) => None,
        }
    }

    pub fn encode_prefix<'input>(&self, input: &'input str) -> Option<(u32, &'input str)> {
        if input.is_empty() {
            return None;
        }
        let first_byte = input.as_bytes()[0];
        let start_index = self
            .vocab
            .partition_point(|token| token.as_bytes()[0] < first_byte);

        let mut best_match = None;
        let mut best_len = 0;
        for (offset, token) in self.vocab[start_index..]
            .iter()
            .enumerate()
            .take_while(|(_, token)| token.as_bytes()[0] == first_byte)
        {
            if token.len() > best_len && input.starts_with(token) {
                let index = start_index + offset;
                best_match = Some((index as u32, &input[token.len()..]));
                best_len = token.len();
            }
        }

        best_match
    }

    pub fn encode<'a>(&'a self, input: &'a str) -> impl Iterator<Item = u32> + 'a {
        let mut remainder = input;
        iter::from_fn(move || match self.encode_prefix(remainder) {
            Some((index, rest)) => {
                remainder = rest;
                Some(index)
            }
            None => None,
        })
    }

    pub fn decode_single(&self, index: u32) -> Option<&str> {
        self.vocab.get(index as usize).map(String::as_str)
    }
}

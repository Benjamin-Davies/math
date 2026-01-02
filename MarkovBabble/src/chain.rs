use std::collections::BTreeMap;

use itertools::Itertools;
use rand::Rng;

pub struct MarkovChain {
    transitions: BTreeMap<(u32, u32), u32>,
    row_totals: BTreeMap<u32, u32>,
}

impl MarkovChain {
    pub fn from_tokens(tokens: impl IntoIterator<Item = u32>) -> Self {
        let mut transitions = BTreeMap::new();
        let mut row_totals = BTreeMap::new();
        for (a, b) in tokens.into_iter().tuple_windows() {
            *transitions.entry((a, b)).or_insert(0) += 1;
            *row_totals.entry(a).or_insert(0) += 1;
        }

        Self {
            transitions,
            row_totals,
        }
    }

    pub fn len(&self) -> usize {
        self.transitions.len()
    }

    pub fn pick_next(&self, mut rng: impl Rng, prev: u32) -> u32 {
        let &row_total = self.row_totals.get(&prev).expect("dead end");

        let mut choice = rng.random_range(0..row_total);
        for (&(_, b), &count) in self.transitions.range((prev, 0)..(prev + 1, 0)) {
            if choice < count {
                return b;
            }
            choice -= count;
        }

        unreachable!("if row is empty, then row_total is never set");
    }
}

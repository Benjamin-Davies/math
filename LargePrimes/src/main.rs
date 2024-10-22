//! Usage: cargo run --release [n]
//!
//! Checks if 2^n - 1 is prime using the Lucas-Lehmer primality test.

use std::{env::args, fmt};

use num_bigint::BigUint;
use num_traits::One;

struct MersenneNumber(u32);

impl MersenneNumber {
    fn value(&self) -> BigUint {
        let two = BigUint::from(2u64);
        two.pow(self.0 as u32) - BigUint::one()
    }

    fn is_prime(&self) -> bool {
        if self.0 < 10 {
            // For small values of n, we can just check if 2^n - 1 is prime.
            return is_prime(2u32.pow(self.0) - 1);
        }

        // https://en.wikipedia.org/wiki/Lucas%E2%80%93Lehmer_primality_test
        // This method of checking primality only works for Mersenne numbers of the form 2^p - 1.
        if !is_prime(self.0) {
            // If n is not prime, then 2^n - 1 is not prime.
            return false;
        }

        let p = self.0;
        let mut s = BigUint::from(4u32);
        let m = self.value();
        for i in 0..p - 2 {
            if i % 1_000 == 0 {
                dbg!(i);
            }
            // The extra mallocs here are negligible compared to the cost of the modulo operation.
            s = (&s * &s - 2u32) % &m;
        }
        s == BigUint::ZERO
    }
}

fn is_prime(n: u32) -> bool {
    // https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes#Pseudocode
    if n <= 1 {
        return false;
    }

    let mut is_prime = vec![true; n as usize + 1];
    // No loss of precision here as the mantissa of f64 can represent u32 exactly.
    let sqrt_n = f64::sqrt(n as f64) as u32;
    for i in 2..=sqrt_n {
        if is_prime[i as usize] {
            for j in (i * i..=n).step_by(i as usize) {
                is_prime[j as usize] = false;
            }
        }
    }
    is_prime[n as usize]
}

impl fmt::Display for MersenneNumber {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "2^{} - 1 = {}", self.0, self.value())
    }
}

fn main() {
    // https://en.wikipedia.org/wiki/Largest_known_prime_number#History
    // This was the largest value that my computer could compute in ~5s.
    const DEFAULT_N: u32 = 23_209;

    let n = args()
        .nth(1)
        .map(|s| s.parse().unwrap())
        .unwrap_or(DEFAULT_N);

    let p = MersenneNumber(n);
    println!("{p}");
    assert!(p.is_prime());
}

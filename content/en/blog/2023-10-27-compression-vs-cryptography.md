---
title: "Compression vs Cryptography: What Comes First?"
slug: "compression-vs-cryptography"
date: "2023-10-27T17:44:44-04:00"
draft: false
image: img/blog/espresso-press.jpg
photo_credit: "Photo by charlesdeluvio on Unsplash"
authors: ['Benjamin Bengfort']
profile: img/team/benjamin-bengfort.png
tags: ['Compression', 'Cryptography', 'Benchmarks']
description: "Data encryption and compression are heavyweight algorithms whose performance is mission critical; but when applying both simultaneously -- which should come first? The answer surprised me!"
---

Data encryption and compression are heavyweight algorithms that must be used with care in performance intensive applications; but when applying both mechanics to the same data, which should come first?

<!--more-->

At Rotational, we routinely use encryption and compression to guarantee privacy and maximize storage. Before applying data to the Ensign log, your events must be both encrypted and compressed -- which led me to the question; which operation should I apply first to ensure that Ensign is as performant as possible? The answer surprised me.

For whatever reason, I had it in my head that cryptography was a heavier weight algorithm than compression and that any cryptographic algorithm would take a large number of CPU cycles. I reasoned, therefore that compression should be applied first -- minimizing the amount of cryptographic work that had to be performed. To be sure, I wrote some [benchmarks in Go](https://gist.github.com/bbengfort/6b6c7957380ec3cda22ea36b21e2d4f2) and was suprised to discover:

> Encryption should be applied before compression for maximum performance.

!["Benchmark Results"](/img/blog/2023-10-27-compression-vs-cryptography/cryptpress_results.png)

The results from my benchmark show the performance as the average number of nanoseconds it takes to complete each operation. The methods are described below:

1. `Encrypt` and `Decrypt`: are the cryptography primitives that use AES-CGM to convert plaintext into ciphertext with a symmetric 32-byte key and vice-versa.
2. `Compress` and `Decompress`: utilize gzip compression built into Go to minimize the space data takes up; two levels of compression are used: _"best speed (fast)"_ and _"best compression (compact)"_.
3. `CryptPress` and `DecryptPress`: applies cryptography first, then compression (the inverse operation decompresses first, then decrypts).
4. `PressCrypt` and `DepressCrypt`: applies compression first, then cryptography (the inverse operation decrypts first, then decompresses).

Encryption first then compression (and its inverse operation) is almost 1.5x faster than applying compression first! In high performance applications, this is a significant and meaningful difference!

## Methodology

```
goos: darwin
goarch: arm64
pkg: github.com/bbengfort/cryptpress
BenchmarkStandalone/Encrypt-10         	        2496	    480928 ns/op	 3908507 B/op	       8 allocs/op
BenchmarkStandalone/Decrypt-10         	        3367	    350098 ns/op	 1737602 B/op	       6 allocs/op
BenchmarkStandalone/Compress-10        	          32	  36125634 ns/op	 1338019 B/op	      30 allocs/op
BenchmarkStandalone/Decompress-10      	         403	   2977850 ns/op	 8442661 B/op	      95 allocs/op
BenchmarkCryptPress/CryptPress-10         	      48	  24525044 ns/op	 9942838 B/op	      35 allocs/op
BenchmarkCryptPress/DecryptPress-10       	     924	   1327536 ns/op	10173869 B/op	      41 allocs/op
BenchmarkPressCrypt/PressCrypt-10         	      32	  36019805 ns/op	 1707577 B/op	      38 allocs/op
BenchmarkPressCrypt/DepressCrypt-10       	     393	   2998849 ns/op	 8607411 B/op	     101 allocs/op
```

### Encryption/Decryption

### Compression/Decompression
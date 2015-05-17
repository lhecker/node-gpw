/**
 * GPW - Generate pronounceable passwords
 * This program uses statistics on the frequency of three-letter sequences
 * in English to generate passwords.  The statistics are
 * generated from your dictionary by the program load_trigram.
 *
 * See www.multicians.org/thvv/gpw.html for history and info.
 * Tom Van Vleck
 *
 * THVV 06/01/94 Coded
 * THVV 04/14/96 converted to Java
 * THVV 07/30/97 fixed for Netscape 4.0
 * THVV 11/27/09 ported to Javascript
 *
 * Leonard Hecker 05/17/15 ported to node.js
 */

function rand() {
	try {
		var buf = crypto.randomBytes(8);

		buf[7] = 0x3F;
		buf[6] |= 0xF0;

		return buf.readDoubleLE(0, false) - 1;
	} catch(e) {
		return rand();
	}
}

function ArrayInverse(array) {
	for (var i = 0; i < array.length; i++) {
		this[array[i]] = i;
	}
}

var crypto = require('crypto');
var alphabet = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ];
var inverseAlphabet = new ArrayInverse(alphabet); // maps each letter to the position within "alphabet"
var trigram = require('./trigram');

module.exports = function gpw(length) {
	var output = '';
	var c1, c2, c3;

	// Pick a random starting point.
	var pik = rand(); // random number [0,1]
	var ranno = pik * 125729.0;
	var sum = 0;

	startLoop:
	for (var c1 = 0; c1 < 26; c1++) {
		for (var c2 = 0; c2 < 26; c2++) {
			for (var c3 = 0; c3 < 26; c3++) {
				sum += trigram[c1][c2][c3];

				if (sum > ranno) {
					output += alphabet[c1];
					output += alphabet[c2];
					output += alphabet[c3];

					// Found start. Break all 3 loops.
					break startLoop;
				}
			}
		}
	}

	// Now do a random walk.
	var nchar = 3;

	while (nchar < length) {
		var c1 = inverseAlphabet[output[nchar - 2]];
		var c2 = inverseAlphabet[output[nchar - 1]];

		sum = 0;

		for (var c3 = 0; c3 < 26; c3++) {
			sum += trigram[c1][c2][c3];
		}

		if (sum === 0) {
			break; // exit while loop
		}

		pik = rand();
		ranno = pik * sum;
		sum = 0;

		for (c3 = 0; c3 < 26; c3++) {
			sum += trigram[c1][c2][c3];

			if (sum > ranno) {
				output += alphabet[c3];
				break;
			}
		}

		nchar++;
	}

	return output;
};

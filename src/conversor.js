export class Music {
  #midiScale = {
    C: 0,
    "C#": 1,
    Db: 1,
    D: 2,
    "D#": 3,
    Eb: 3,
    E: 4,
    F: 5,
    "F#": 6,
    Gb: 6,
    G: 7,
    "G#": 8,
    Ab: 8,
    A: 9,
    "A#": 10,
    Bb: 10,
    B: 11,
  };
  text;
  // Chords + lyrics
  constructor(title, tone, text) {
    if (!title || !tone || !text) {
      throw new Error("Title, tone, and text cannot be empty");
    }

    this.title = title;
    this.tone = tone;
    this.chordsWithBrackets = this.getLyrics(text);
    this.chordsWithoutBrackets = this.chordsWithBrackets.map((chord) =>
      this.removeBracketFromChord(chord)
    );
    this.onlyLyrics = this.getChords(text);
    this.chordPositions = this.findChordPositions(text, this.chordsWithBrackets);
    this.OriginalText = text;
  }
  getChords(text) {
    const regex = /\[.*?\]/g;
    return text.replace(regex, "");
  }
  getLyrics(text) {
    const regex = /\[(.*?)\]/g;
    if (text.match(regex) === null) {
      return [];
    } else {
      return text.match(regex);

    }
  }
  // removes "m", "0-9" and "+"
  extractSuffix(chord) {
    const suffix = chord.match(/m|[0-9]|\+/g)?.join("") || "";
    const chordWithoutSuffix = chord.replace(suffix, "");
    return { chordWithoutSuffix, suffix };
  }
  calculateNewToneIndex(toneIndex, value) {
    return (((toneIndex + value) % 12) + 12) % 12;
  }
  findNewTone(newToneIndex) {
    return Object.keys(this.#midiScale).find(
      (key) => this.#midiScale[key] === newToneIndex
    );
  }
  changeChord(chord, value) {
    // Extract the chord without suffix and the suffix from the chord
    const { chordWithoutSuffix, suffix } = this.extractSuffix(chord);
    // Get the tone index from the midiScale
    const toneIndex = this.#midiScale[chordWithoutSuffix];

    // If the tone is not found, return the chord as it is
    if (toneIndex === undefined) {
      console.error(`Tone ${chordWithoutSuffix} not found in midiScale`);
      return chord;
    }

    // Calculate the new tone index
    const newToneIndex = this.calculateNewToneIndex(toneIndex, value);
    // Find the new tone based on the new tone index
    const newTone = this.findNewTone(newToneIndex);

    // If the new tone is not found, return the chord as it is
    if (newTone === undefined) {
      console.error(
        `New tone with index ${newToneIndex} not found in midiScale`
      );
      return chord;
    }

    // Combine the new tone with the suffix to get the new chord
    chord = newTone + suffix;
    return chord;
  }
  removeBracketFromChord(chord) {
    return chord.replace(/\[|\]/g, "");
  }
  findChordPositions(OriginalText, chordsWithBrackets) {
    // Initialize an array to store the positions of the chords in the text
    var chordPositions = [];
    var tmp_text = OriginalText;
    // Initialize a variable to keep track of the length of the chords found so far
    var removeAlreadyFound = 0;

    if (OriginalText === null) {
      return chordPositions;
    }

    // Loop over each chord in the chords array
    for (let index = 0; index < chordsWithBrackets.length; index++) {
      // Get the current chord
      let element = chordsWithBrackets[index];

      // Find the position of the current chord in the text
      let position = tmp_text.indexOf(element);
      let spaceSize = element.length;
      let spaces = " ".repeat(spaceSize);
      tmp_text = tmp_text.replace(element, spaces);
      // Subtract the length of the chords found so far from the position and add the result to the chordPositions array
      chordPositions.push(position - removeAlreadyFound);

      // Add the length of the current chord to the total length of the chords found so far
      removeAlreadyFound += element.length;
    }
    return chordPositions;
  }

  // wtf, this is a mess, refactor this shit
  formatChords() {
    let formattedChords = "";
    const chordPositions = this.chordPositions;
    let surplus = 0;
    let setChords = new Set();
    for (let index = 0; index < this.chordsWithoutBrackets.length; index++) {
      const chord = this.chordsWithoutBrackets[index];
      const chordPosition = this.chordPositions[index];
      const diff = formattedChords.length - chordPosition
      if ((formattedChords.length) === chordPosition || setChords.has(chordPosition)) {
        formattedChords += chord + " ";
      }
      else {
        if (diff > 0) {
          surplus += diff
          this.onlyLyrics = this.onlyLyrics.substring(0, chordPosition) + "-".repeat(diff) + this.onlyLyrics.substring(chordPosition);
        }
        else {
          formattedChords += " ".repeat(Math.abs(diff) + surplus)
        }
        setChords.add(chordPosition)
        formattedChords += chord + " ";


      }
    }
    return formattedChords.trimEnd();
  }
  transposeChords(value) {
    if (value === 0) {
      this.chordsWithBrackets = this.getLyrics(this.OriginalText);
      this.chordsWithoutBrackets = this.chordsWithBrackets.map((chord) =>
        this.removeBracketFromChord(chord)
      );
    } else {
      this.chordsWithoutBrackets = this.chordsWithoutBrackets.map((chord) => {
        if (chord.includes("/")) {
          let [mainChord, bassNote] = chord.split("/");
          mainChord = this.changeChord(mainChord, value);
          bassNote = this.changeChord(bassNote, value);
          return mainChord + "/" + bassNote;
        } else {
          return this.changeChord(chord, value);
        }
      });

      this.chordsWithBrackets = this.chordsWithBrackets.map((chord, index) => {
        const chordWithoutBrackets = this.removeBracketFromChord(chord);
        const transposedChord = this.chordsWithoutBrackets[index];
        return chord.replace(chordWithoutBrackets, transposedChord);
      });
    }
  }
}

// ---------------------------------------
const text1 = "Sua [Eb/G]graça pro[F]vou Seu a[Eb]mor [Bb/D][Cm][Bb]";
const text2 = "[Cm]Gr[Eb/F]ande é o Se[Bb]nhor!";
const test = new Music("hello", "C", text2)
test.transposeChords(1);
console.log(test.formatChords());
console.log(test.onlyLyrics);

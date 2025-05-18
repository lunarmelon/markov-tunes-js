const NOTES = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"];

const FREQUENCIES = {
	Do: "C4",
	Re: "D4",
	Mi: "E4",
	Fa: "F4",
	Sol: "G4",
	La: "A4",
	Si: "B4",
};

const TRANSITION_MATRIX = {
	Do: {
		Do: 0.1429,
		Re: 0.1429,
		Mi: 0.1429,
		Fa: 0.1429,
		Sol: 0.1429,
		La: 0.1429,
		Si: 0.1429,
	},
	Re: {
		Do: 0.1429,
		Re: 0.1429,
		Mi: 0.1429,
		Fa: 0.1429,
		Sol: 0.1429,
		La: 0.1429,
		Si: 0.1429,
	},
	Mi: {
		Do: 0.1429,
		Re: 0.1429,
		Mi: 0.1429,
		Fa: 0.1429,
		Sol: 0.1429,
		La: 0.1429,
		Si: 0.1429,
	},
	Fa: {
		Do: 0.1429,
		Re: 0.1429,
		Mi: 0.1429,
		Fa: 0.1429,
		Sol: 0.1429,
		La: 0.1429,
		Si: 0.1429,
	},
	Sol: {
		Do: 0.1429,
		Re: 0.1429,
		Mi: 0.1429,
		Fa: 0.1429,
		Sol: 0.1429,
		La: 0.1429,
		Si: 0.1429,
	},
	La: {
		Do: 0.1429,
		Re: 0.1429,
		Mi: 0.1429,
		Fa: 0.1429,
		Sol: 0.1429,
		La: 0.1429,
		Si: 0.1429,
	},
	Si: {
		Do: 0.1429,
		Re: 0.1429,
		Mi: 0.1429,
		Fa: 0.1429,
		Sol: 0.1429,
		La: 0.1429,
		Si: 0.1429,
	},
};

const synth = new Tone.Synth().toDestination();

const playButton = document.getElementById("playBtn");
const noteButtons = document.querySelectorAll(".note-box");

// Choose next note based on these explicit probabilities
function chooseNextNote(current) {
	const transitions = TRANSITION_MATRIX[current];
	const options = Object.keys(transitions);
	const weights = Object.values(transitions);

	const cumulative = weights.reduce((acc, w, i) => {
		acc.push(w + (acc[i - 1] || 0));
		return acc;
	}, []);

	const rand = Math.random();
	return options[cumulative.findIndex((c) => rand <= c)];
}

// Play & highlight a single note
async function playNote(note) {
	await Tone.start();

	for (const btn of noteButtons) {
		btn.classList.remove("active");
	}

	const btn = document.querySelector(`.note-box[data-note="${note}"]`);
	btn?.classList.add("active");

	synth.triggerAttackRelease(FREQUENCIES[note], "8n");

	setTimeout(() => btn?.classList.remove("active"), 500);
}

// Generate full Markov melody
async function generateMelody(start = "Do", length = 20) {
	playButton.disabled = true;
	for (const btn of noteButtons) {
		btn.disabled = true;
	}

	let current = start;
	for (let i = 0; i < length; i++) {
		await playNote(current);
		await new Promise((r) => setTimeout(r, 500));
		current = chooseNextNote(current);
	}

	playButton.disabled = false;
	for (const btn of noteButtons) {
		btn.disabled = false;
	}
}

// Event handlers
playButton.addEventListener("click", () => generateMelody("Do", 25));
for (const btn of noteButtons) {
	btn.addEventListener("click", () => {
		const n = btn.getAttribute("data-note");
		if (n) playNote(n);
	});
}

document.addEventListener("keydown", (e) => {
	if (e.code === "Space" && !playButton.disabled) {
		e.preventDefault();
		const randNote = NOTES[Math.floor(Math.random() * NOTES.length)];
		playNote(randNote);
	}
});

const textElement = document.getElementById('game-text');
const optionButtonsElement = document.getElementById('option-buttons');
const audio = document.getElementById('audio');

let state = {};

$(document).ready(() => {
  startGame();
  audio.play();
});

// start game function - shows the first step in the game
function startGame() {
  audio.playbackRate = 0.5;
  state = {};
  showTextNode(1);
}

// finds and displays the current step
function showTextNode(textNodeIndex) {
  // finds the right node to display
  const textNode = textNodes.find(textNode => textNode.id === textNodeIndex);
  textElement.innerText = textNode.text;
  // removes all children of element
  while (optionButtonsElement.firstChild) {
    optionButtonsElement.removeChild(optionButtonsElement.firstChild);
  }

  // displays all the options for the current step
  textNode.options.forEach(option => {
    if (showOption(option)) {
      const button = document.createElement('button');
      button.innerText = option.text;
      button.classList.add('btn');
      // add click eventlistener for options
      button.addEventListener('click', () => selectOption(option));
      optionButtonsElement.appendChild(button);
    }
  });
}

function showOption(option) {
  return option.requiredState == null || option.requiredState(state);
}

function selectOption(option) {
  const nextTextNodeId = option.nextText;
  if (nextTextNodeId <= 0) {
    return startGame();
  }
  audio.playbackRate += 0.1;
  state = Object.assign(state, option.setState);
  showTextNode(nextTextNodeId);
}

const textNodes = [
  {
    id: 1,
    text:
      'You are the renowned sheriff of Hutchinson, Kansas. It’s the year of 1951 and you are in charge of locating the missing daughter of Mayer. Roberts. This isn’t the only case of missing children, lately the past six months there have been four reporting of missing children and they all were last seen around the area of the closed asylum in the outskirts of town. \n WILL YOU INVESTIGATE THE ASYLUM?',

    options: [
      {
        text: 'Yes',
        setState: { blueGoo: true },
        nextText: 2
      }
    ]
  },
  {
    id: 2,
    text:
      'October 11th, you are at the gates to the Hutchinson Mental Institution. It’s raining heavy and the dark clouds thicken the sky. You approach the entrance and inspect the building. it’s a huge white complex with three stories and two wings on the right and left side of the center part. Darkness fills the windows around the courtyard, even though not a soul is to be seen. You still have a feeling that you might not be alone.  You examine the entrance door, there are two big metal doors with a chain covering the handles. Your crowbar in the trunk won’t be enough; maybe there is a maintenance building where you could find a bolt cutter or an axe. \n WILL YOU HAVE A LOOK AROUND?',
    options: [
      {
        text: 'Continue',
        requiredState: currentState => currentState.blueGoo,
        setState: { blueGoo: true },
        nextText: 3
      }
    ]
  },
  {
    id: 3,
    text:
      'You find a maintenance building located in the center of the fenced courtyard, as expected the door is locked. Upon arriving the sky has turned pitch black and you have a hard time locating any useful equipment. You crunch your way around the small building; there you find a small window barely big enough for you to crawl through. \n WHAT DO YOU DO? ',
    options: [
      {
        text: 'Break it',
        nextText: 4
      },
      {
        text: 'Search the courtyard for a key',
        nextText: 5
      }
    ]
  },
  {
    id: 4,
    text:
      'You brace your elbow and bash it into the window, the sound of splintered glass echoes around the empty courtyard. You climb through the small window, once inside you are met with a view of peeling wallpapers and a ticking sound from one of the leaking water pipes. Upon further glance you find old patient records scattered on the floor and eerie photographs.  Amongst the photographs you recognize a face; it’s a photograph of the Mayor’s daughter. \n DO YOU PICK UP THE PHOTOGRAPH?',
    options: [
      {
        text: 'Yes',
        nextText: 6
      },
      {
        text: 'No',
        nextText: 9
      }
    ]
  },
  {
    id: 5,
    text:
      'Since the door is locked and the window is barely big enough, you start looking around the courtyard.  Usually people keep a spare key nearby; even you have a spare key buried in the garden outside of your house. You start digging with your bare hands; your nails are covered in pesky black dirt and there is an unpleasant smell around you. You stop to realise the echoing sound of footsteps coming closer, whilst still on your knees you turn around…Maybe you made the wrong choice?',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 6,
    text:
      'You reach down to pick up the photograph. On the back of the photograph there is a date scrambled in black nearly faded ink, dated 5th of October 1941. Something about this photograph doesn’t seem right… You reach for your back pocket where you keep your calendar and as expected today’s date marks the 11th of October 1951. In the corner of the room you hear a calm clinking sound caused by the draft from the window. You gently place the photograph in your calendar and move towards the sound, hanging from a shelf you find the keys quietly clinking in to each other. \n DO YOU TAKE THE KEYS? ',
    options: [
      {
        text: 'Yes',
        nextText: 7
      }
    ]
  },
  {
    id: 7,
    text:
      'With the keys in a firm grip you make your way towards the main entrance, after a couple of attempts to budge the chain with your crowbar you realise that the keys might unlock the chain. \n WHICH KEY WOULD YOU LIKE TO TRY FIRST?',
    options: [
      {
        text: 'A small triangular shaped key',
        nextText: 8
      },
      {
        text: 'A rounded key with a welded crown',
        nextText: 10
      },
      {
        text: 'A key shaped like an upside down crucifix',
        nextText: 11
      }
    ]
  },
  {
    id: 8,
    text:
      'In your profession as a sheriff you have encountered similar locks before and this is the perfect fit.',
    options: [
      {
        text: 'Enter',
        nextText: 12
      }
    ]
  },
  {
    id: 9,
    text:
      'In your already busy quest to find either a bolt cutter or a key you think nothing about the picture of the Mayors daughter. One of your colleagues must have accidently dropped it here in the search for her last week. In the corner of the torn room you hear a calm clinking sound caused by the draft from the window. You move towards the sound. Hanging from a shelf you find the keys quietly clinking in to each other. \n DO YOU TAKE THE KEYS?',
    options: [
      {
        text: 'Yes',
        nextText: 7
      }
    ]
  },
  {
    id: 12,
    text:
      'You enter the abandoned Asylum with a shiver down your spine and a pearl of sweat just reached your eyebrow. You stand in the giant hallway for what seems to be ages and when your eyes finally adjust to the darkness you can distinguish a broken piano at the end of the hallway. However there is no sign of the Mayor’s daughter or anyone else for that matter. For some reason you call out her name “Judy”…you scream at top of your lungs. After no reply you think of how unreasonable you act, the big metal doors were locked and there is no other way to get into the building. Still you can’t shake the feeling of being watched.',
    options: [
      {
        text: 'Continue',
        nextText: 13
      }
    ]
  },
  {
    id: 13,
    text:
      'Despite the unpleasant feeling you make your way through the hallway, it’s after all your job to find out what happened to the missing children. You have already ruled out abduction and animal attacks. It’s not likely that they were murdered either since a body should have turned up by now, murderers are usually sloppy and it’s especially hard to hide several bodies in a small town like yours. You search the first floor without any sign of the missing children; by the stairs you find an old drawing of the premises. When you first saw the Asylum you noticed three stories, but according to the drawings there is also a basement.',
    options: [
      {
        text: 'Basement',
        nextText: 14
      },
      {
        text: 'Second floor',
        nextText: 15
      }
    ]
  },
  {
    id: 14,
    text:
      'You find a flashlight and begin your search in the basement, the spiral stairs are creaking and the smell of something rotten hits you. The same eerie photographs that you found in the maintenance building are covering the walls; in a larger scale you can easily distinguish the faces of old patients. One of the photographs caught your attention; it’s a photograph of the missing children playing in the courtyard. Standing close by is a man and he seems to be guarding them or at least keeping an eye on them. If someone asked you to describe the man in one word, the most fitting would be “Dark”.  You take a closer look in the left corner. The photograph is taken 5th of October 1941, exactly like the one gently tucked in your calendar. Suddenly you hear a harsh, unmelodious strike from the piano on the first floor.',
    options: [
      {
        text: 'Run upstairs',
        nextText: 16
      },
      {
        text: 'Hide',
        nextText: 17
      }
    ]
  },
  {
    id: 16,
    text:
      'You run upstairs with eyes wide open and saliva foaming from your lips. You feel the adrenaline pumping through your veins and you are determined to catch the prankster. You must be in shock because when you finally make it to the hallway you see…him…dark…foul. You must’ve hit your head because when you open your eyes again he’s gone. You’re on the floor and your mouth tastes like sand. All you can feel is a pounding pain coming from your head; you reach for your gun which is tightly strapped in your belt, it was a stupid mistake to not unstrap it before you ran upstairs.',
    options: [
      {
        text: 'Get up',
        nextText: 18
      },
      {
        text: 'Fall asleep',
        nextText: 19
      },
      {
        text: 'Radio your colleagues',
        nextText: 20
      }
    ]
  },
  {
    id: 17,
    text:
      'You are tumbling in the dark, searching for your flashlight that you dropped. The photograph is stuck in your head, WHAT DOES IT MEAN and how can the photograph be dated 1941? The children do have one thing in common; they were all born that year. But in the photographs they look exactly like they did when they went missing. Your hands grips onto something, it’s a mirror lying on the floor. Even though darkness surrounds you, a face clearly appears behind you. You are not as safe as you thought you were…',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 10,
    text: 'The welded crown is for the entrance metal doors. ',
    options: [
      {
        text: 'Try again',
        nextText: 7
      }
    ]
  },
  {
    id: 18,
    text:
      'With the gun in your left hand and unstable legs you manage to pull yourself up, the photograph in the basement is stuck in your head. WHAT DOES IT MEAN AND HOW CAN IT BE DATED 1941? The children do have one thing in common; they were all born that year. But in the photograph from 1941 they look exactly like they did when they went missing last week.  Something about this place is wrong, really wrong. ',
    options: [
      {
        text: 'Search for clues on the second floor',
        nextText: 15
      }
    ]
  },
  {
    id: 19,
    text:
      'Unfortunately you didn’t wake up again. Your colleagues found you hanging from the rooftop and your death was classified as suicide caused by dissociative identity disorder.',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 20,
    text:
      'You hit the radio button to alert your colleagues but all you can hear is a distorted scream coming from the speaker. This is the last thing your colleagues heard from you, since you disappeared the same night. After your disappearance the case you were in charge of was dropped and remains a cold case to this day.',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 15,
    text: 'Get up',
    options: [
      {
        text: 'Search for clues upstairs',
        nextText: 21
      }
    ]
  },
  {
    id: 11,
    text: 'Surely this key must serve a different purpose. ',
    options: [
      {
        text: 'Try again',
        nextText: 7
      }
    ]
  }
];

// ljud, spooky sound, high score kopplat till progress.
// eventuella bilder.

const textElement = document.getElementById('game-text');
const optionButtonsElement = document.getElementById('option-buttons');
const audio = document.getElementById('audio');

let state = {};
let highscores = new Array();
let score = 0;

// add event listeners when document has loaded
$(document).ready(() => {
  let menuVisible = false;
  $('#menu-bar').click(() => {
    if (!menuVisible) {
      $('.header #buttons').css('display', 'flex');
      $('#menu-bar').addClass('menu-bar-active');
    } else {
      $('#buttons').css('display', 'none');
      $('#menu-bar').removeClass('menu-bar-active');
    }
    menuVisible = !menuVisible;
  });
  // valid variable - if name input is valid
  let valid = false;
  // disable submit button for name input
  $('#name-input button').prop('disabled', 'true');
  // checks if input value is valid after each keyup event
  $('#user-input').keyup(() => {
    let res = validate($('#name-input input').val());
    if (res) {
      // enable submit button for name input
      $('#name-input button').removeAttr('disabled');
      $('#name-input #error').css('display', 'none');
      valid = true;
    } else {
      $('#name-input button').prop('disabled', 'true');
      $('#name-input #error').css('display', 'block');
      valid = false;
    }
  });

  // click listener on name input submit button
  // if input is valid - add to highscore
  $('#name-input button').click(() => {
    if (valid) {
      addHighscore($('#name-input input').val(), score);
    }
  });

  // click listener for restart button
  $('#restart').click(() => {
    restart();
  });

  startGame();
  getHighscore();
  createHighscore();

  // once highscore modal has loaded add event listeners to its content
  $('#highscore-modal').ready(() => {
    // click listener for highscore button in header
    $('#highscore-btn').click(() => {
      $('#highscore-modal').show();
    });

    // click listener in highscore modal
    // if click is outisde the content, then close
    $('#highscore-modal').click(e => {
      if (!$(e.target).is('#content') && !$(e.target).is('#content *')) {
        $('#highscore-modal').hide();
      }
    });
  });
});

// start game function - shows the first step in the game
function startGame() {
  audio.playbackRate = 0.5;
  state = {};
  audio.play();
  showTextNode(1);
  score = 0;
}

// validate name input
// only accepts a-z and 0-9
// protect from xss
function validate(str) {
  let regex = /^[A-Za-z0-9]+$/;
  return regex.test(str);
}

// 1. add highscore to highscore list
// 2. sort highscore list
// 3. redirect to highscore list
function addHighscore(name, score) {
  let newScore = new Score(name, score);
  highscores.push(newScore);
  highscores.sort((a, b) => {
    return b.score - a.score;
  });
  if (highscores.length > 10) {
    highscores.pop();
  }
  saveHighscore();
  createHighscore();
  $('#game-over #name-input').hide();
  $('#game-over #highscore').show();
}

// save highscore list from localhost
function saveHighscore() {
  let newhighscores = JSON.stringify(highscores);
  localStorage.setItem('highscore', newhighscores);
}

// get highscore list from localhost
function getHighscore() {
  highscores = [];
  if (localStorage.getItem('highscore')) {
    let tmpHighscores = JSON.parse(localStorage.getItem('highscore'));
    tmpHighscores.forEach((item, index) => {
      let newScore = new Score(item.name, item.score);
      highscores.push(newScore);
    });
  }
}

// game over function - displays game over modal and pause audio
function gameOver() {
  $('#game-over').show();

  if (highscores.length < 10 || highscores[9].score < score) {
    $('#game-over #name-input').show();
  } else {
    $('#game-over #highscore').show();
  }
  audio.pause();
}

// create elements and add content to both highscore lists
function createHighscore() {
  $('#game-over #highscore div').html('');
  $('#highscore-modal #content div').html('');
  highscores.forEach(item => {
    let nameEl1 = document.createElement('p');
    let nameEl2 = document.createElement('p');
    nameEl1.className = 'name';
    nameEl2.className = 'name';
    nameEl1.innerHTML = item.name;
    nameEl2.innerHTML = item.name;
    let scoreEl1 = document.createElement('p');
    let scoreEl2 = document.createElement('p');
    scoreEl1.className = 'score';
    scoreEl2.className = 'score';
    scoreEl1.innerHTML = item.score;
    scoreEl2.innerHTML = item.score;
    $('#game-over #highscore div').append(nameEl1);
    $('#game-over #highscore div').append(scoreEl1);
    $('#highscore-modal #content div').append(nameEl2);
    $('#highscore-modal #content div').append(scoreEl2);
  });
}

// restart function
// hide game over modal with all its content
// restart game
function restart() {
  $('#game-over').hide();
  $('#game-over #name-input').hide();
  $('#game-over #highscore').hide();
  startGame();
}

// score class, holds name and score and then put into highscore list
class Score {
  constructor(name, score) {
    this.name = name;
    this.score = score;
  }
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
    return gameOver();
  }

  score += 50;
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
        setState: { Image: true },
        nextText: 6
      },
      {
        text: 'No',
        setState: { NoImage: true },
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
        text: 'Continue to highscore',
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
        requiredState: currentState => currentState.Image,
        setState: { Image: true },
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
        text: 'Continue to highscore',
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
        text: 'Continue to highscore',
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
        text: 'Continue to highscore',
        nextText: -1
      }
    ]
  },
  {
    id: 15,
    text:
      'When you reach the second floor you find yourself in a long hallway, the condition is even worse than downstairs. There are small rooms on each side of the walls; this is probably where the patients used to sleep. You begin searching the first room to your right, in the middle of the room you find a bath filled with water. The walls are covered in chains and straps, which were probably used to prevent the patients from climbing out. You remember hearing about “Hydrotherapy” when you were younger, doctors would leave their patients in the tubs for several days. Suddenly you hear a familiar voice calling for you.',
    options: [
      {
        text: 'Follow the voice',
        nextText: 21
      }
    ]
  },
  {
    id: 21,
    text:
      'The voice is coming from the hallway and it is definitely a girl’s voice. You whisper back “Who are you?” but there’s no answer. You turn around and walk back to the hallway and that’s when you finally catch a glimpse of her, Judy. You run after her down the corridor and in a desperate try you reach for her. You grab her by the arm but when you look down on your hands they are covered in blood and a black mark is left on her arm.  A silent giggle leaves her mouth and you start to panic, “Are you ok?  We have looked everywhere for you Judy”. She goes quiet for a while and then she asks “Sheriff will you please help me find my friends?”',
    options: [
      {
        text: 'Help Judy',
        nextText: 22
      }
    ]
  },
  {
    id: 22,
    text:
      'Finding Judy is a relief and you are positive that you will find the other children as well. You are already looking forward to the celebration party the town will hold in your honour. Since Judy seems to know this place well you follow her around the abandoned place. Now and then you hear her giggle; the poor child must be traumatized. After a few corners you finally reach a door, after a closer inspection you find the lock to be odd, it’s shaped like an upside down crucifix. Judy is certain that her friends are in there and politely asks if you brought the keys from the maintenance building with you. How can she know about the keys?',
    options: [
      {
        text: 'Unlock the door',
        requiredState: currentState => currentState.Image,
        setState: { Image: true },
        nextText: 23
      },
      {
        text: 'Unlock the door',
        requiredState: currentState => currentState.NoImage,
        setState: { NoImage: true },
        nextText: 27
      },
      {
        text: 'Show her the photograph',
        requiredState: currentState => currentState.Image,
        setState: { Image: true },
        nextText: 25
      }
    ]
  },
  {
    id: 25,
    text:
      'Her friendly tone sends an uncomfortable feeling down your spine, it’s the same feeling you had when you saw her photograph in the maintenance building and then again in the basement. You reach for your back pocket where the photograph is still tucked away in your calendar. You show it to her, hoping for a good explanation but when you look in to her eyes all you can see is disregard. Her voice transforms in to a scornful laugh. Standing in front of you is no longer a girl, it’s the man.',
    options: [
      {
        text: 'Run',
        nextText: 26
      }
    ]
  },
  {
    id: 26,
    text:
      'They say that the average reaction time for a human brain is 0.25 seconds to a visual stimulus, 0.17 for an audio stimulus and 0.15 seconds for a touch stimulus. You retired shortly after the incident at the asylum, the case was never solved and your memories are now fading. To this day you are still not sure what happened that night in October 1951, but somehow you survived to tell the tale even though no one believed you.',
    options: [
      {
        text: 'The end',
        nextText: -1
      }
    ]
  },
  {
    id: 23,
    text:
      'You try the keys you used earlier and as expected they don’t work on this door. Deep down you know which key is the right fit, you noticed it earlier. Judy is looking straight at you with a grin; she knows what you are thinking right now. There is no chance in hell that Judy could’ve seen you grab those keys from the maintenance building, the doors were locked and had a heavy chain around the handles…Unless…she also has a key. Sshh shut her out of your head; think about the children behind the door. You begin contemplating the night, there’s nothing wrong with this place but something is definitely wrong with Judy. It almost seems as if she doesn’t belong here, in this world.',
    options: [
      {
        text: 'Enter',
        nextText: 28
      }
    ]
  },
  {
    id: 27,
    text:
      'Maybe if you were more aware of your surroundings and did some investigation you wouldn’t have missed some important clues. I know it’s easy to get carried away with a hard cracked case such as this but you should have seen the signs. Maybe you should try again.',
    options: [
      {
        text: 'Continue to highscore',
        nextText: -1
      }
    ]
  },
  {
    id: 28,
    text:
      'The room is empty except for one big photograph leaning against a brick wall; you ask Judy if she has been in this room before. She answers “I live here”, you are still confused but you have so many questions.',
    options: [
      {
        text: 'Where exactly do you live?',
        nextText: 29
      },
      {
        text: 'Who are you?',
        nextText: 30
      },
      {
        text: 'Where are the other children?',
        nextText: 31
      },
      {
        text: 'Continue',
        nextText: 32
      }
    ]
  },
  {
    id: 29,
    text:
      'Judy points towards the photograph and as you walk deeper in to the room you see the contours of a man in the photograph.  You take a closer look on his face, there are two black holes where his eyes should be and his lips are curved in a cruel smile.',
    options: [
      {
        text: 'Ask more',
        nextText: 28
      }
    ]
  },
  {
    id: 30,
    text:
      'My name is Moloch and I know you have heard my name before. My name was the last word Judy’s mother whispered to you before she passed in childbirth on the 5th of October 1941. You also know that Judy was stillborn at first. A few minutes after her mother’s death they miraculously found a heartbeat but I really didn’t think you would be that naive Sheriff and believe in the advance of medicine.  From time to time I crawl back to my world but I often prefer to live amongst you.',
    options: [
      {
        text: 'Ask more',
        nextText: 28
      }
    ]
  },
  {
    id: 31,
    text:
      'Come on Sheriff; don’t waste your time on stupid questions you already have the answers to. You have already found them. Do you remember the photograph in the basement?',
    options: [
      {
        text: 'Ask more',
        nextText: 28
      }
    ]
  },
  {
    id: 32,
    text:
      'A call was connected to a dispatcher in the early morning on the 12th of October 1951. Judy was later found crying on the doorsteps to the asylum. Your body was never found, neither was the photograph in the basement. If someone finds the photograph in the future they will also find you, standing behind the children with eyes wide open and an empty gaze. The town held a memorial in memory of you and Judy wore a smirk that day. The case was classified as solved and went to rest for a couple of years before someone went missing again.',
    options: [
      {
        text: 'The end',
        nextText: -1
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

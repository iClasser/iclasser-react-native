# iClasser Flash Cards

This component is used for flash cards, it flips

## Installation

Run `npm i @iclasser-react-native/flash-cards`

# Usage

```JSX
import react from 'react';
import FlashCards from '@iclasser-react-native/flash-cards'
const structureComponent = {
    type: compKey,
    props: {
      flashcards: [
        {
          id: "flashcard1",
          front: "flashcard1_front",
          front_image:
            "https://iclasser-cloud.s3.amazonaws.com/iclasser/logo_dark_no-label_cfxsrh.png",
          back: "flashcard1_back",
        },
      ],
    },
  }
const contents = {
    flashcard1_front: "Verbal Evaluation",
    flashcard1_back:
      "Your speech evaluator will deliver a verbal evaluation before the club meeting is finished. The verbal evaluation is in front of the club. ",
  }
const codingContents = [];
const compOptions = {
    componentIndex: 0,
    textData: ()=> {
        getText: (key)=> {
            return contents[key]
        }
    },
    codingContents,
    a11yScale: 1,
    structureComponent,
    colorTokens={
      brand: {
        primary: {
          main: {
            text: '#000',
            stroke: '#dedede',
          },
        },
      },
    }
}
function Example(){
    return <FlashCards {...compOptions} >
}
```

# Requirements


# Cross platform available

- React.js -- Yes, Public
- React Native - Yes, but used internally within iClasser App

# Screenshots or video

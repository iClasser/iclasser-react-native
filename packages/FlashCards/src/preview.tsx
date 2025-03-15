// src/FlashCardsPreview.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';

// Type definitions (optional)
export interface Flashcard {
  id: string;
  front: string;
  front_image?: string;
  back_title?: string;
  back: string;
}

export interface StructureComponentProps {
  props: {
    flashcards: Flashcard[];
  };
  [key: string]: any;
}

export interface FlashCardsPreviewProps {
  textData: {
    getText: (id: string) => string;
  };
  structureComponent: StructureComponentProps;
  a11yScale?: number;
  colorTokens?: any;
}

// Single flip card component with animated icon
const FlipCard = ({ 
  flashcard, 
  textData,
  a11yScale = 1,
  colorTokens,
}: { 
  flashcard: Flashcard; 
  textData: any;
  a11yScale?: number;
  colorTokens?: any;
}) => {
  // Animation value for card flip
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  // Interpolate rotation for front and back sides
  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg']
  });
  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg']
  });

  const flipCard = () => {
    if (flipped) {
      Animated.spring(animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
      setFlipped(false);
    } else {
      Animated.spring(animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
      setFlipped(true);
    }
  };

  // Animation for the flip icon: pop in then a slow slide/rotate loop
  const popInAnim = useRef(new Animated.Value(0.5)).current;
  const slideAnim = useRef(new Animated.Value(0)).current; // controls slight translation & rotation

  useEffect(() => {
    // Pop in animation: scale from 0.5 to 1 in 100ms
    Animated.timing(popInAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      // Once popIn is done, start a continuous slide animation with a delay
      Animated.loop(
        Animated.sequence([
          Animated.delay(1000), // delay before starting the loop
          Animated.timing(slideAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [popInAnim, slideAnim]);

  // Derive small translation and rotation values from slideAnim
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });
  const rotate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '30deg']
  });

  return (
    <TouchableWithoutFeedback onPress={flipCard}>
      <View style={styles.cardContainer}>
        {/* Front Side */}
        <Animated.View
          style={[
            styles.flipCard,
            {
              transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
              backgroundColor: colorTokens?.brand.primary.main.color || '#fff',
              borderColor: colorTokens?.brand.primary.main.stroke || '#fff'
            },
          ]}
        >
          <View style={styles.cardFace}>
            {flashcard.front_image ? (
              <Image
                source={{ uri: flashcard.front_image }}
                style={styles.image}
                resizeMode="contain"
              />
            ) : null}
            <Text
              style={[
                styles.title,
                {
                  color: colorTokens?.brand.primary.main.text || '#000',
                  fontSize: 20 * a11yScale,
                  lineHeight: 30 * a11yScale,
                },
              ]}
            >
              {textData.getText(flashcard.front)}
            </Text>
            <Animated.Image
              source={require('../assets/components/flashcards/flip.png')}
              style={[
                styles.flipIcon,
                {
                  transform: [{ scale: popInAnim }, { translateX }, { rotate }],
                },
              ]}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Back Side */}
        <Animated.View
          style={[
            styles.flipCard,
            styles.flipCardBack,
            {
              transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
              backgroundColor: colorTokens?.brand.primary.main.color || '#fff',
              borderColor: colorTokens?.brand.primary.main.stroke || '#fff',
            },
          ]}
        >
          <View style={styles.cardFace}>
            {flashcard.front ? (
              <Text
                style={[
                  styles.title,
                  {
                    color: colorTokens?.brand.primary.main.text || '#000',
                    fontSize: 20 * a11yScale,
                    lineHeight: 30 * a11yScale,
                  },
                ]}
              >
                {textData.getText(flashcard.front)}
              </Text>
            ) : null}
            <Text
              style={[
                styles.text,
                {
                  fontSize: 16 * a11yScale,
                  color: colorTokens?.brand.primary.main.text || '#000',
                  lineHeight: 24 * a11yScale,
                },
              ]}
            >
              {textData.getText(flashcard.back)}
            </Text>
            <Animated.Image
              source={require('../assets/components/flashcards/flip-back.png')}
              style={[
                styles.flipIcon,
                {
                  transform: [{ scale: popInAnim }, { translateX }, { rotate }],
                },
              ]}
              resizeMode="contain"
            />
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Main component: renders a list of flip cards
const FlashCardsPreview = ({
  structureComponent,
  textData,
  a11yScale,
  colorTokens,
}: FlashCardsPreviewProps) => {
  const { flashcards } = structureComponent.props;
  if (!flashcards || flashcards.length === 0) return null;

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      {flashcards.map((flashcard: Flashcard) => (
        <FlipCard
          a11yScale={a11yScale}
          colorTokens={colorTokens}
          key={flashcard.id}
          flashcard={flashcard}
          textData={textData}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    alignItems: 'center'
  },
  cardContainer: {
    width: 345,
    height: 345,
    marginBottom: 20
  },
  flipCard: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 30
  },
  flipCardBack: {},
  cardFace: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  title: {
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center'
  },
  text: {
    textAlign: 'center'
  },
  image: {
    width: 150,
    height: 150
  },
  flipIcon: {
    position: 'absolute',
    bottom: 12,
    width: 25,
    height: 25,
    borderRadius: 4
  }
});

export default FlashCardsPreview;

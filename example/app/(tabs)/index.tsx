import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import FlashCardsPreview from '@/components/FlashCard/preview';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/logo_dark.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">FlashCard</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">iClasser RN FlashCard Preview</ThemedText>
        
        {/* preview */}
        <FlashCardsPreview
          structureComponent={{
            props: {
              flashcards: [
                {
                  id: '1',
                  front: 'Hello',
                  back: 'World',
                },
                {
                  id: '2',
                  front: 'React',
                  back: 'Native',
                },
              ],
            },
          }}
          textData={{
            getText: (text) => text,
          }}
          a11yScale={1}
          colorTokens={{
            brand: {
              primary: {
                main: {
                  text: '#000',
                  stroke: '#dedede',
                },
              },
            },
          }}
        />
      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

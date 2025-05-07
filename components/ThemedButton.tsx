import { useThemeColor } from '@/hooks/useThemeColor';
import { Pressable, PressableProps, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

export type ThemedButtonProps = PressableProps & {
  title: string;
  buttonTextColorLight?: string;
  buttonBackgroundLight?: string;
  buttonTextColorDark?: string;
  buttonBackgroundDark?: string;
  textType?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedButton({
  title,
  style,
  buttonTextColorLight,
  buttonBackgroundLight,
  buttonTextColorDark,
  buttonBackgroundDark,
  textType = 'defaultSemiBold',
  ...rest
}: ThemedButtonProps) {
  const buttonBackground = useThemeColor({ light: buttonBackgroundLight, dark: buttonBackgroundDark }, 'buttonBackground');
  
  return (
    <Pressable
      style={({ pressed }) => {
        const computedStyle = typeof style === 'function' ? style({ pressed, hovered: false }) : style;
        return [
          styles.button,
          { backgroundColor: pressed ? '#ccc' : buttonBackground },
          computedStyle,
        ];
      }}
      {...rest}
    >
      <ThemedText
        style={styles.text}
        lightColor={buttonTextColorLight}
        darkColor={buttonTextColorDark}
        type={textType}
      >
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    // extra
  },
});

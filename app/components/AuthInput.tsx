import { TextInput, TextInputProps } from 'react-native';

export default function AuthInput(props: TextInputProps) {
  return (
    <TextInput
      className={['w-full bg-primary-dark/60 text-text-light placeholder-text-light rounded-xl px-4 py-3 mb-4 text-base', props.className].filter(Boolean).join(' ')}
      placeholderTextColor="#A0AEC0"
      {...props}
    />
  );
} 
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

export default function AuthButton({ children, ...props }: TouchableOpacityProps & { children: React.ReactNode }) {
  return (
    <TouchableOpacity
      className="w-full bg-primary py-3 rounded-xl items-center mt-2 active:opacity-80 disabled:opacity-50"
      {...props}
    >
      <Text className="text-white text-base font-semibold">{children}</Text>
    </TouchableOpacity>
  );
} 
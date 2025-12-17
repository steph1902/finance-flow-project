import "nativewind/types";

// NativeWind v4 type declarations
// This extends React Native component props to accept className

declare module "react-native" {
    interface ViewProps {
        className?: string;
    }
    interface TextProps {
        className?: string;
    }
    interface ImageProps {
        className?: string;
    }
    interface TouchableOpacityProps {
        className?: string;
    }
    interface TouchableHighlightProps {
        className?: string;
    }
    interface TouchableWithoutFeedbackProps {
        className?: string;
    }
    interface PressableProps {
        className?: string;
    }
    interface ScrollViewProps {
        className?: string;
        contentContainerClassName?: string;
    }
    interface FlatListProps<ItemT> {
        className?: string;
        contentContainerClassName?: string;
    }
    interface TextInputProps {
        className?: string;
    }
    interface SwitchProps {
        className?: string;
    }
    interface ActivityIndicatorProps {
        className?: string;
    }
    interface KeyboardAvoidingViewProps {
        className?: string;
    }
    interface SafeAreaViewProps {
        className?: string;
    }
}

declare module "react-native-safe-area-context" {
    interface SafeAreaViewProps {
        className?: string;
    }
}

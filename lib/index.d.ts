import React, { Component } from "react";
import { StyleProp, ViewStyle, TextStyle, NativeSyntheticEvent, TextInputKeyPressEventData, TextInputProps } from "react-native";
import { Animation, CustomAnimation } from "react-native-animatable";
interface AnimateOptions {
    animation?: Animation;
    duration?: number;
}
interface SmoothPinCodeInputProps {
    value: string;
    codeLength?: number;
    cellSize?: number;
    cellSpacing?: number;
    placeholder?: string | React.ReactNode;
    mask?: string | React.ReactNode;
    maskDelay?: number;
    password?: boolean;
    autoFocus?: boolean;
    restrictToNumbers?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    cellStyle?: StyleProp<ViewStyle>;
    cellStyleFocused?: StyleProp<ViewStyle>;
    cellStyleFilled?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    textStyleFocused?: StyleProp<TextStyle>;
    animated?: boolean;
    animationFocused?: Animation | CustomAnimation;
    onFulfill?: (code: string) => void;
    onChangeText?: (text: string) => void;
    onBackspace?: () => void;
    onTextChange?: (text: string) => void;
    testID?: string;
    onFocus?: () => void;
    onBlur?: () => void;
    keyboardType?: TextInputProps["keyboardType"];
    editable?: boolean;
    inputProps?: Partial<TextInputProps>;
    disableFullscreenUI?: boolean;
}
interface SmoothPinCodeInputState {
    maskDelay: boolean;
    focused: boolean;
}
declare class SmoothPinCodeInput extends Component<SmoothPinCodeInputProps, SmoothPinCodeInputState> {
    private ref;
    private inputRef;
    private maskTimeout?;
    constructor(props: SmoothPinCodeInputProps);
    animate: ({ animation, duration, }: AnimateOptions) => Promise<{
        finished: boolean;
    }>;
    shake: () => Promise<{
        finished: boolean;
    }>;
    focus: () => void;
    blur: () => void;
    clear: () => void;
    _inputCode: (code: string) => void;
    _keyPress: (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
    _onFocused: () => void;
    _onBlurred: () => void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
    static defaultProps: Partial<SmoothPinCodeInputProps>;
}
export default SmoothPinCodeInput;
//# sourceMappingURL=index.d.ts.map
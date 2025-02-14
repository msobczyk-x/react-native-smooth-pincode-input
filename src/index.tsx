import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  I18nManager,
  StyleProp,
  ViewStyle,
  TextStyle,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInputProps,
} from "react-native";
import * as Animatable from "react-native-animatable";
import {
  AnimatableProps,
  Animation,
  CustomAnimation,
} from "react-native-animatable";

const styles = StyleSheet.create({
  containerDefault: {},
  cellDefault: {
    borderColor: "gray",
    borderWidth: 1,
  },
  cellFocusedDefault: {
    borderColor: "black",
    borderWidth: 2,
  },
  textStyleDefault: {
    color: "gray",
    fontSize: 24,
  },
  textStyleFocusedDefault: {
    color: "black",
  },
});

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

class SmoothPinCodeInput extends Component<
  SmoothPinCodeInputProps,
  SmoothPinCodeInputState
> {
  private ref: React.RefObject<Animatable.View & AnimatableProps<ViewStyle>>;
  private inputRef: React.RefObject<TextInput>;
  private maskTimeout?: NodeJS.Timeout;

  constructor(props: SmoothPinCodeInputProps) {
    super(props);
    this.state = {
      maskDelay: false,
      focused: false,
    };
    this.ref = React.createRef();
    this.inputRef = React.createRef();
  }

  animate = ({
    animation = "shake",
    duration = 650,
  }: AnimateOptions): Promise<{ finished: boolean }> => {
    if (!this.props.animated) {
      return Promise.reject(new Error("Animations are disabled"));
    }
    if (this.ref.current && typeof this.ref.current[animation] === "function") {
      return this.ref.current[animation](duration);
    }
    return Promise.reject(new Error("Animation not found"));
  };

  shake = (): Promise<{ finished: boolean }> =>
    this.animate({ animation: "shake" });

  focus = (): void => {
    this.inputRef.current?.focus();
  };

  blur = (): void => {
    this.inputRef.current?.blur();
  };

  clear = (): void => {
    this.inputRef.current?.clear();
  };

  _inputCode = (code: string): void => {
    const { password, codeLength = 4, onTextChange, onFulfill } = this.props;

    if (this.props.restrictToNumbers) {
      code = (code.match(/[0-9]/g) || []).join("");
    }

    if (onTextChange) {
      onTextChange(code);
    }
    if (code.length === codeLength && onFulfill) {
      onFulfill(code);
    }

    // handle password mask
    const maskDelay = password && code.length > (this.props.value?.length || 0); // only when input new char
    this.setState({ maskDelay: maskDelay || false });

    if (maskDelay) {
      // mask password after delay
      clearTimeout(this.maskTimeout);
      this.maskTimeout = setTimeout(() => {
        this.setState({ maskDelay: false });
      }, this.props.maskDelay);
    }
  };

  _keyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>
  ): void => {
    if (event.nativeEvent.key === "Backspace") {
      const { value, onBackspace } = this.props;
      if (value === "" && onBackspace) {
        onBackspace();
      }
    }
  };

  _onFocused = (): void => {
    this.setState({ focused: true });
    if (typeof this.props.onFocus === "function") {
      this.props.onFocus();
    }
  };

  _onBlurred = (): void => {
    this.setState({ focused: false });
    if (typeof this.props.onBlur === "function") {
      this.props.onBlur();
    }
  };

  componentWillUnmount(): void {
    if (this.maskTimeout) {
      clearTimeout(this.maskTimeout);
    }
  }

  render(): React.ReactNode {
    const {
      value = "",
      codeLength = 4,
      cellSize = 48,
      cellSpacing = 4,
      placeholder = "",
      password = false,
      mask = "*",
      autoFocus = false,
      containerStyle,
      cellStyle,
      cellStyleFocused,
      cellStyleFilled,
      textStyle,
      textStyleFocused,
      keyboardType = "numeric",
      animationFocused = "pulse",
      animated = true,
      testID,
      editable = true,
      inputProps = {},
      disableFullscreenUI = true,
    } = this.props;

    const { maskDelay, focused } = this.state;

    return (
      <Animatable.View
        ref={this.ref}
        style={[
          {
            alignItems: "stretch",
            flexDirection: "row",
            justifyContent: "center",
            position: "relative",
            width: cellSize * codeLength + cellSpacing * (codeLength - 1),
            height: cellSize,
          },
          containerStyle,
        ]}
      >
        <View
          style={{
            position: "absolute",
            margin: 0,
            height: "100%",
            flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
            alignItems: "center",
          }}
        >
          {Array.apply(null, Array(codeLength)).map((_, idx) => {
            const cellFocused = focused && idx === value.length;
            const filled = idx < value.length;
            const last = idx === value.length - 1;
            const showMask = filled && password && (!maskDelay || !last);
            const isPlaceholderText = typeof placeholder === "string";
            const isMaskText = typeof mask === "string";
            const pinCodeChar = value.charAt(idx);

            let cellText: string | null = null;
            if (filled || placeholder !== null) {
              if (showMask && isMaskText) {
                cellText = mask;
              } else if (!filled && isPlaceholderText) {
                cellText = placeholder;
              } else if (pinCodeChar) {
                cellText = pinCodeChar;
              }
            }

            const placeholderComponent = !isPlaceholderText
              ? placeholder
              : null;
            const maskComponent = showMask && !isMaskText ? mask : null;
            const isCellText = typeof cellText === "string";

            return (
              <Animatable.View
                key={idx}
                style={[
                  {
                    width: cellSize,
                    height: cellSize,
                    marginLeft: cellSpacing / 2,
                    marginRight: cellSpacing / 2,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  cellStyle,
                  cellFocused ? cellStyleFocused : {},
                  filled ? cellStyleFilled : {},
                ]}
                animation={
                  idx === value.length && focused && animated
                    ? animationFocused
                    : undefined
                }
                iterationCount="infinite"
                duration={500}
              >
                {isCellText && !maskComponent && (
                  <Text
                    style={[textStyle, cellFocused ? textStyleFocused : {}]}
                  >
                    {cellText}
                  </Text>
                )}

                {!isCellText && !maskComponent && placeholderComponent}
                {isCellText && maskComponent}
              </Animatable.View>
            );
          })}
        </View>
        <TextInput
          disableFullscreenUI={disableFullscreenUI}
          value={value}
          ref={this.inputRef}
          onChangeText={this._inputCode}
          onKeyPress={this._keyPress}
          onFocus={this._onFocused}
          onBlur={this._onBlurred}
          spellCheck={false}
          autoFocus={autoFocus}
          keyboardType={keyboardType}
          numberOfLines={1}
          caretHidden
          maxLength={codeLength}
          selection={{
            start: value.length,
            end: value.length,
          }}
          style={{
            flex: 1,
            opacity: 0,
            textAlign: "center",
          }}
          testID={testID}
          editable={editable}
          {...inputProps}
        />
      </Animatable.View>
    );
  }

  static defaultProps: Partial<SmoothPinCodeInputProps> = {
    codeLength: 4,
    cellSize: 48,
    cellSpacing: 4,
    placeholder: "",
    password: false,
    mask: "*",
    maskDelay: 200,
    keyboardType: "numeric",
    autoFocus: false,
    restrictToNumbers: false,
    containerStyle: styles.containerDefault,
    cellStyle: styles.cellDefault,
    cellStyleFocused: styles.cellFocusedDefault,
    textStyle: styles.textStyleDefault,
    textStyleFocused: styles.textStyleFocusedDefault,
    animationFocused: "pulse",
    animated: true,
    editable: true,
    inputProps: {},
    disableFullscreenUI: true,
  };
}

export default SmoothPinCodeInput;

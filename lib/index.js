"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const Animatable = __importStar(require("react-native-animatable"));
const styles = react_native_1.StyleSheet.create({
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
class SmoothPinCodeInput extends react_1.Component {
    constructor(props) {
        super(props);
        this.animate = ({ animation = "shake", duration = 650, }) => {
            if (!this.props.animated) {
                return Promise.reject(new Error("Animations are disabled"));
            }
            if (this.ref.current && typeof this.ref.current[animation] === "function") {
                return this.ref.current[animation](duration);
            }
            return Promise.reject(new Error("Animation not found"));
        };
        this.shake = () => this.animate({ animation: "shake" });
        this.focus = () => {
            var _a;
            (_a = this.inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        };
        this.blur = () => {
            var _a;
            (_a = this.inputRef.current) === null || _a === void 0 ? void 0 : _a.blur();
        };
        this.clear = () => {
            var _a;
            (_a = this.inputRef.current) === null || _a === void 0 ? void 0 : _a.clear();
        };
        this._inputCode = (code) => {
            var _a;
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
            const maskDelay = password && code.length > (((_a = this.props.value) === null || _a === void 0 ? void 0 : _a.length) || 0); // only when input new char
            this.setState({ maskDelay: maskDelay || false });
            if (maskDelay) {
                // mask password after delay
                clearTimeout(this.maskTimeout);
                this.maskTimeout = setTimeout(() => {
                    this.setState({ maskDelay: false });
                }, this.props.maskDelay);
            }
        };
        this._keyPress = (event) => {
            if (event.nativeEvent.key === "Backspace") {
                const { value, onBackspace } = this.props;
                if (value === "" && onBackspace) {
                    onBackspace();
                }
            }
        };
        this._onFocused = () => {
            this.setState({ focused: true });
            if (typeof this.props.onFocus === "function") {
                this.props.onFocus();
            }
        };
        this._onBlurred = () => {
            this.setState({ focused: false });
            if (typeof this.props.onBlur === "function") {
                this.props.onBlur();
            }
        };
        this.state = {
            maskDelay: false,
            focused: false,
        };
        this.ref = react_1.default.createRef();
        this.inputRef = react_1.default.createRef();
    }
    componentWillUnmount() {
        if (this.maskTimeout) {
            clearTimeout(this.maskTimeout);
        }
    }
    render() {
        const { value = "", codeLength = 4, cellSize = 48, cellSpacing = 4, placeholder = "", password = false, mask = "*", autoFocus = false, containerStyle, cellStyle, cellStyleFocused, cellStyleFilled, textStyle, textStyleFocused, keyboardType = "numeric", animationFocused = "pulse", animated = true, testID, editable = true, inputProps = {}, disableFullscreenUI = true, } = this.props;
        const { maskDelay, focused } = this.state;
        return (react_1.default.createElement(Animatable.View, { ref: this.ref, style: [
                {
                    alignItems: "stretch",
                    flexDirection: "row",
                    justifyContent: "center",
                    position: "relative",
                    width: cellSize * codeLength + cellSpacing * (codeLength - 1),
                    height: cellSize,
                },
                containerStyle,
            ] },
            react_1.default.createElement(react_native_1.View, { style: {
                    position: "absolute",
                    margin: 0,
                    height: "100%",
                    flexDirection: react_native_1.I18nManager.isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                } }, Array.apply(null, Array(codeLength)).map((_, idx) => {
                const cellFocused = focused && idx === value.length;
                const filled = idx < value.length;
                const last = idx === value.length - 1;
                const showMask = filled && password && (!maskDelay || !last);
                const isPlaceholderText = typeof placeholder === "string";
                const isMaskText = typeof mask === "string";
                const pinCodeChar = value.charAt(idx);
                let cellText = null;
                if (filled || placeholder !== null) {
                    if (showMask && isMaskText) {
                        cellText = mask;
                    }
                    else if (!filled && isPlaceholderText) {
                        cellText = placeholder;
                    }
                    else if (pinCodeChar) {
                        cellText = pinCodeChar;
                    }
                }
                const placeholderComponent = !isPlaceholderText
                    ? placeholder
                    : null;
                const maskComponent = showMask && !isMaskText ? mask : null;
                const isCellText = typeof cellText === "string";
                return (react_1.default.createElement(Animatable.View, { key: idx, style: [
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
                    ], animation: idx === value.length && focused && animated
                        ? animationFocused
                        : undefined, iterationCount: "infinite", duration: 500 },
                    isCellText && !maskComponent && (react_1.default.createElement(react_native_1.Text, { style: [textStyle, cellFocused ? textStyleFocused : {}] }, cellText)),
                    !isCellText && !maskComponent && placeholderComponent,
                    isCellText && maskComponent));
            })),
            react_1.default.createElement(react_native_1.TextInput, Object.assign({ disableFullscreenUI: disableFullscreenUI, value: value, ref: this.inputRef, onChangeText: this._inputCode, onKeyPress: this._keyPress, onFocus: this._onFocused, onBlur: this._onBlurred, spellCheck: false, autoFocus: autoFocus, keyboardType: keyboardType, numberOfLines: 1, caretHidden: true, maxLength: codeLength, selection: {
                    start: value.length,
                    end: value.length,
                }, style: {
                    flex: 1,
                    opacity: 0,
                    textAlign: "center",
                }, testID: testID, editable: editable }, inputProps))));
    }
}
SmoothPinCodeInput.defaultProps = {
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
exports.default = SmoothPinCodeInput;
//# sourceMappingURL=index.js.map
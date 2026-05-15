import type {ProgramMainData} from "ollieos/types";
import {useCallback, useRef, useState} from "react";

type Operation = "+" | "-" | "*" | "/";

const NumberButton = ({num, on_click, double = false}: {num: string, on_click: (num: string) => void, double?: boolean}) => (
    <button onClick={() => on_click(num)} className={`cursor-pointer bg-surface text-on-surface py-1 px-2 rounded text-lg font-mono ${double ? "col-span-2" : ""}`}>
        {num}
    </button>
);

const OperationButton = ({op, on_click, stored_op}: {op: Operation, on_click: (op: Operation) => void, stored_op?: Operation}) => (
    <button onClick={() => on_click(op)} className={`cursor-pointer bg-accent text-on-accent py-1 px-2 rounded text-lg font-mono ${stored_op === op ? "font-bold outline-solid outline-2 outline-primary" : ""}`}>
        {op === "*" ? "×" : op === "/" ? "÷" : op}
    </button>
);

const AllClearButton = ({on_click}: {on_click: () => void}) => (
    <button onClick={on_click} className="cursor-pointer bg-danger text-white py-1 px-2 rounded text-lg font-mono">
        AC
    </button>
);

const ClearEntryButton = ({on_click}: {on_click: () => void}) => (
    <button onClick={on_click} className="cursor-pointer bg-danger-surface text-danger border-solid border-2 border-danger py-1 px-2 rounded text-lg font-mono">
        CE
    </button>
);

const EqualsButton = ({on_click, double}: {on_click: () => void, double?: boolean}) => (
    <button onClick={on_click} className={`cursor-pointer bg-primary text-white py-1 px-2 rounded text-lg font-mono ${double ? "row-span-2" : ""}`}>
        =
    </button>
);

const PointButton = ({on_click}: {on_click: () => void}) => (
    <button onClick={on_click} className="cursor-pointer bg-surface text-on-surface py-1 px-2 rounded text-lg font-mono">
        .
    </button>
);

const PercentButton = ({on_click}: {on_click: () => void}) => (
    <button onClick={on_click} className="cursor-pointer bg-accent text-on-accent py-1 px-2 rounded text-lg font-mono">
        %
    </button>
);

const MRCButton = ({on_click, memory_value}: {on_click: () => void, memory_value: number | null}) => (
    <button
        onClick={on_click}
        className="cursor-pointer bg-accent-2 text-on-accent-2 py-1 px-2 rounded text-lg font-mono relative"
        title="Press once to recall memory, press twice to clear memory"
    >
        MRC

        {memory_value !== null && (
            <span className="absolute -top-4 left-0 text-xs w-full text-center text-muted">
                M: {memory_value}
            </span>
        )}
    </button>
);

const MPlusButton = ({on_click}: {on_click: () => void}) => (
    <button onClick={on_click} className="cursor-pointer bg-accent-2 text-on-accent-2 py-1 px-2 rounded text-lg font-mono">
        M+
    </button>
);

const NegateButton = ({on_click}: {on_click: () => void}) => (
    <button onClick={on_click} className="cursor-pointer bg-accent text-on-accent py-1 px-2 rounded text-lg font-mono">
        ±
    </button>
);

const SquareRootButton = ({on_click}: {on_click: () => void}) => (
    <button onClick={on_click} className="cursor-pointer bg-accent text-on-accent py-1 px-2 rounded text-lg font-mono">
        √
    </button>
);

export const App = ({main_data, css_height}: {main_data: ProgramMainData, css_height: string}) => {
    const [screen_value, setScreenValue] = useState("0");
    const is_value_dirty = useRef(false);

    const operand_register = useRef<number | null>(null);
    const operation_register = useRef<Operation | null>(null);
    const last_calculation_register = useRef<{operand: number, operation: Operation} | null>(null);

    const [highlighted_operation, setHighlightedOperation] = useState<Operation | null>(null);
    const last_button_press = useRef<string | null>(null);

    const input_number = useCallback(
        (num: string) => {
            last_calculation_register.current = null;

            if (is_value_dirty.current) {
                setScreenValue((prev) => prev === "0" ? num : prev + num);
            } else {
                is_value_dirty.current = true;
                setScreenValue(num);
            }

            last_button_press.current = num;
        },
        []
    );

    const input_point = useCallback(
        () => {
            last_calculation_register.current = null;

            if (is_value_dirty.current) {
                // only allow adding a decimal point if there isn't already one in the current value
                setScreenValue((prev) => prev.includes(".") ? prev : prev + ".");
            } else {
                is_value_dirty.current = true;
                setScreenValue("0.");
            }

            last_button_press.current = ".";
        },
        []
    );

    const format_result = useCallback(
        (result: number) => {
            // use precision limit to try to trim floating point errors, then trim trailing zeros and decimal point if not needed
            return parseFloat(result.toPrecision(12)).toString();
        },
        []
    )

    const calculate_result = useCallback(
        () => {
            let current_value: number;

            if (last_calculation_register.current !== null) {
                // repeat the last calculation if equals is pressed again without a new input
                current_value = last_calculation_register.current.operand;
                operation_register.current = last_calculation_register.current.operation;
                operand_register.current = parseFloat(screen_value);
            } else {
                current_value = parseFloat(screen_value);
            }

            if (operand_register.current !== null && operation_register.current !== null) {
                let result: number;

                switch (operation_register.current) {
                    case "+":
                        result = operand_register.current + current_value;
                        break;
                    case "-":
                        result = operand_register.current - current_value;
                        break;
                    case "*":
                        result = operand_register.current * current_value;
                        break;
                    case "/":
                        if (current_value === 0) {
                            // handle division by zero by clearing registers and displaying an error message
                            operand_register.current = null;
                            operation_register.current = null;
                            setHighlightedOperation(null);
                            setScreenValue("Error!");
                            is_value_dirty.current = false;
                            last_button_press.current = "=";
                            return;
                        }

                        result = operand_register.current / current_value;
                        break;
                }

                // use precision limit to try to trim floating point errors
                setScreenValue(format_result(result));
                is_value_dirty.current = false;

                // store result for reapplication
                last_calculation_register.current = {
                    operand: current_value,
                    operation: operation_register.current as Operation
                };

                operand_register.current = null;
                operation_register.current = null;
                setHighlightedOperation(null);

                last_button_press.current = "=";

                return result;
            }
        },
        [screen_value]
    );

    const input_operation = useCallback(
        (op: Operation) => {
            last_calculation_register.current = null;

            // if already storing an operand and operation, calculate the result first and use that as the new operand as well as displaying it
            if (operand_register.current !== null && operation_register.current !== null) {
                const result = calculate_result();

                if (result !== undefined) {
                    operand_register.current = result;
                } else {
                    operand_register.current = null;
                    operation_register.current = null;
                }
            }

            operand_register.current = parseFloat(screen_value);
            operation_register.current = op;

            setHighlightedOperation(op);
            last_button_press.current = op;

            is_value_dirty.current = false;
        },
        [screen_value]
    );

    const all_clear = useCallback(
        () => {
            last_calculation_register.current = null;

            setScreenValue("0");
            is_value_dirty.current = false;

            operand_register.current = null;
            operation_register.current = null;

            setHighlightedOperation(null);

            last_button_press.current = "ac";
        },
        []
    );

    const clear_entry = useCallback(
        () => {
            last_calculation_register.current = null;

            setScreenValue("0");
            is_value_dirty.current = false;

            last_button_press.current = "ce";
        },
        []
    );

    const percent = useCallback(
        () => {
            const current_value = parseFloat(screen_value);

            // if no pending operation, do simple division by 100
            if (operation_register.current === null) {
                const result = current_value / 100;
                setScreenValue(result.toString());
                is_value_dirty.current = false;

                last_button_press.current = "%";
                return;
            }

            let result: number;

            switch (operation_register.current) {
                case "+":
                case "-":
                    // for addition and subtraction, percentage is relative to the operand (tipping mode)
                    result = operand_register.current * (current_value / 100);
                    break;
                case "*":
                case "/":
                    // for multiplication and division, percentage is relative to 1 (converting mode)
                    result = current_value / 100;
                    break;
            }

            setScreenValue(result.toString());
            is_value_dirty.current = false;

            last_button_press.current = "%";
        },
        [screen_value]
    );

    const memory_register = useRef<number>(0);
    const [displayed_memory, setDisplayedMemory] = useState<number | null>(null);

    const mrc = useCallback(
        () => {
            if (last_button_press.current === "mrc") {
                // double press means clear memory
                memory_register.current = 0;
                setDisplayedMemory(null);
                last_button_press.current = "mc";
            } else {
                setScreenValue(memory_register.current.toString());
                is_value_dirty.current = false;
                last_button_press.current = "mrc";
            }
        },
        []
    );

    const m_plus = useCallback(
        () => {
            const current_value = parseFloat(screen_value);
            memory_register.current += current_value;
            setDisplayedMemory(memory_register.current);
            last_button_press.current = "m+";
        },
        [screen_value]
    );

    const negate = useCallback(
        () => {
            const current_value = parseFloat(screen_value);
            const result = -current_value;
            setScreenValue(result.toString());
            last_button_press.current = "negate";
        },
        [screen_value]
    );

    const square_root = useCallback(
        () => {
            const current_value = parseFloat(screen_value);
            if (current_value >= 0) {
                const result = Math.sqrt(current_value);
                setScreenValue(result.toString());
                is_value_dirty.current = false;
                last_button_press.current = "sqrt";
            }
        },
        [screen_value]
    );

    return (
        <main className="bg-background flex flex-col items-center p-4 gap-6" style={{height: css_height}}>
            <input readOnly value={screen_value} className="bg-surface text-on-surface py-1 px-2 rounded text-right w-full text-lg font-mono" />

            <div className="grid grid-cols-4 gap-2 w-full">
                <MRCButton on_click={mrc} memory_value={displayed_memory} />
                <MPlusButton on_click={m_plus} />
                <NegateButton on_click={negate} />
                <SquareRootButton on_click={square_root} />

                <AllClearButton on_click={all_clear} />
                <ClearEntryButton on_click={clear_entry} />
                <PercentButton on_click={percent} />
                <OperationButton op="/" on_click={input_operation} stored_op={highlighted_operation} />

                <NumberButton num="7" on_click={input_number} />
                <NumberButton num="8" on_click={input_number} />
                <NumberButton num="9" on_click={input_number} />
                <OperationButton op="*" on_click={input_operation} stored_op={highlighted_operation} />

                <NumberButton num="4" on_click={input_number} />
                <NumberButton num="5" on_click={input_number} />
                <NumberButton num="6" on_click={input_number} />
                <OperationButton op="-" on_click={input_operation} stored_op={highlighted_operation} />

                <NumberButton num="1" on_click={input_number} />
                <NumberButton num="2" on_click={input_number} />
                <NumberButton num="3" on_click={input_number} />
                <OperationButton op="+" on_click={input_operation} stored_op={highlighted_operation} />

                <NumberButton num="0" on_click={input_number} double />
                <PointButton on_click={input_point} />

                <EqualsButton on_click={calculate_result} />
            </div>
        </main>
    );
}

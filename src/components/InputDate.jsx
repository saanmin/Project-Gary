'use client'

import { InputWithError } from "@/components/ui/input-with-error";
import { IMaskMixin } from 'react-imask';

const MaskedInput = IMaskMixin(({ inputRef, ...props }) => (
    <InputWithError
        {...props}
        ref={inputRef}
    />
));

export const InputDate = ({
    value,
    onChange,
    error,
    className,
}) => {
    const handleAccept = (value) => {
        if (onChange) {
            onChange({ target: { value } });
        }
    };

    return (
        <div className="grid grid-cols-4 gap-4 items-top">
            <div className="col-span-3">
                <MaskedInput
                    mask="0000-00-00"
                    definitions={{
                        '0': /[0-9]/
                    }}
                    id="baseDate"
                    name="baseDate"
                    value={value}
                    onAccept={handleAccept}
                    className={className || "w-1/3"}
                    error={error}
                    placeholder="YYYY-MM-DD"
                    lazy={false}
                />
            </div>
        </div>
    );
}

export default InputDate;
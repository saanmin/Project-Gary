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

    const handleChange = (e) => {
        // IMask가 처리하도록 하기 위해 onChange는 빈 함수로 처리
        // 실제 값은 onAccept에서 처리됨
    };

    return (

        <>
            <MaskedInput
                mask="0000-00-00"
                definitions={{
                    '0': /[0-9]/
                }}
                id="baseDate"
                name="baseDate"
                value={value}
                onChange={handleChange}
                onAccept={handleAccept}
                className={className || "w-1/3"}
                error={error}
                placeholder="YYYY-MM-DD"
                lazy={false}
            />
        </>

    );
}

export default InputDate;
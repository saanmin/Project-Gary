import { Label } from "@/components/ui/label"

const RequiredLabel = ({ children, ...props }) => {
    return (
        <Label {...props}>
            {children}
            <span className="relative text-red-500 text-sm font-medium align-top -top-0.5 pl-1">*</span>
        </Label>
    )
}

export { RequiredLabel }
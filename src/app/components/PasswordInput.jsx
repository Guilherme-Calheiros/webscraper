import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

export default function PasswordInput({ value, onChange, ...props }) {
    const [show, setShow] = useState(false);

    return (
        <div className="relative">
            <input 
                type={show ? "text" : "password"}
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                {...props}
            />
            <button onClick={() => setShow(!show)} type="button" className="absolute right-2 top-2">
                {show ? <EyeOff /> : <Eye />}
            </button>
        </div>
    );
}
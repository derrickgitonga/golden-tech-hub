import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";

interface StkPushModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (pin: string) => void;
    amount: number;
    businessName?: string;
    accountReference?: string;
}

const StkPushModal: React.FC<StkPushModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    amount,
    businessName = "BackMarket Traders",
    accountReference = "Order Payment"
}) => {
    const [pin, setPin] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setPin("");
            setIsLoading(false);
        }
    }, [isOpen]);

    const handleConfirm = async () => {
        if (!pin) return;

        setIsLoading(true);
        // Simulate network delay for authenticity
        await new Promise(resolve => setTimeout(resolve, 1500));

        onConfirm(pin);
        setIsLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[350px] bg-[#2C2C2E] text-white border-gray-700">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-center text-xl font-normal border-b border-gray-600 pb-3">
                        M-PESA
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-200 text-base pt-2">
                        Do you want to pay KES {amount.toLocaleString()} to {businessName} Account no. {accountReference}?
                    </DialogDescription>
                    <div className="text-center text-gray-200 text-base">
                        Enter M-PESA PIN
                    </div>
                </DialogHeader>

                <div className="py-4">
                    <div className="relative">
                        <Input
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="text-center text-lg tracking-widest bg-white text-black border-none h-10"
                            maxLength={4}
                            autoFocus
                        />
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                    </div>
                </div>

                <DialogFooter className="flex-row gap-2 sm:justify-center">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1 bg-gray-600 hover:bg-gray-500 text-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!pin || isLoading}
                        className="flex-1 bg-[#4CAF50] hover:bg-[#45a049] text-white"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default StkPushModal;

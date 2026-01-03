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
import { Loader2 } from "lucide-react";

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

    useEffect(() => {
        if (isOpen) {
            setPin("");
            setIsLoading(false);
        }
    }, [isOpen]);

    const handleConfirm = async () => {
        if (!pin || pin.length !== 4) return;

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        onConfirm(pin);
        setIsLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && pin.length === 4 && !isLoading) {
            handleConfirm();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md w-[95vw] sm:w-full bg-[#1a1a1a] text-white border-gray-700 rounded-lg">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-center text-xl font-semibold text-white">
                        M-PESA
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <DialogDescription className="text-center text-gray-300 text-sm leading-relaxed px-2">
                        Do you want to pay{' '}
                        <span className="font-semibold text-white">KES {amount.toLocaleString()}</span>
                        {' '}to{' '}
                        <span className="font-semibold text-white">{businessName}</span>
                        {' '}Account no.{' '}
                        <span className="font-semibold text-white">{accountReference}</span>?
                    </DialogDescription>

                    <div className="space-y-3">
                        <div className="text-center text-gray-400 text-sm">
                            Enter M-PESA PIN
                        </div>
                        <div className="flex justify-center px-4">
                            <Input
                                type="password"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={pin}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    setPin(value.slice(0, 4));
                                }}
                                onKeyPress={handleKeyPress}
                                className="w-full max-w-[280px] h-12 text-center text-xl tracking-[0.8em] bg-white text-black border-2 border-gray-300 focus:border-green-500 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md placeholder:tracking-normal placeholder:text-gray-400"
                                maxLength={4}
                                autoFocus
                                placeholder="••••"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex flex-row gap-3 sm:gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 h-11 bg-gray-700 hover:bg-gray-600 text-white border-gray-600 hover:border-gray-500 rounded-md font-medium"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={pin.length !== 4 || isLoading}
                        className="flex-1 h-11 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-green-600"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            "Send"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default StkPushModal;
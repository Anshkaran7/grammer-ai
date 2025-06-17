"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle,
  Copy,
  RotateCcw,
  Sparkles,
  Info,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function GrammarCorrection() {
  const [inputText, setInputText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasCorrection, setHasCorrection] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setCharCount(inputText.length);
  }, [inputText]);

  const correctGrammar = useCallback(async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to correct.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/grammar-correct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error("Failed to correct grammar");
      }

      const data = await response.json();
      setCorrectedText(data.correctedText);
      setHasCorrection(true);

      toast.success("Text corrected successfully!");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        correctGrammar();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [correctGrammar]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Text copied!");
    } catch (error) {
      toast.error("Couldn't copy text");
    }
  };

  const reset = () => {
    setInputText("");
    setCorrectedText("");
    setHasCorrection(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Grammar AI
          </h1>
          <p className="text-base sm:text-lg font-medium text-gray-600 mb-4">
            Fix your English & Hinglish text instantly
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Smart Correction
            </Badge>
            <Badge
              variant="secondary"
              className="bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Press ⌘/Ctrl + Enter to correct
            </Badge>
          </div>
        </motion.div>

        <div className="grid gap-6 md:gap-8 md:grid-cols-2">
          {/* Input Section */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden h-full transition-shadow hover:shadow-xl">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <span>Your Text</span>
                  <AnimatePresence>
                    {inputText && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge variant="outline" className="font-normal">
                          {charCount} characters
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600">
                  Type in English, Hinglish, or mixed text
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your text here... Examples:
• Main kal office ke liye late ho gaya tha
• Mujhe movie dekhne ka plan cancel karna pada
• Kya tum mere saath shopping pe chaloge?"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] sm:min-h-[240px] resize-none rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                />
                <div className="flex gap-2 sm:gap-3">
                  <Button
                    onClick={correctGrammar}
                    disabled={isLoading || !inputText.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 sm:h-11 transition-all"
                  >
                    {isLoading ? (
                      <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Correcting...
                      </motion.div>
                    ) : (
                      <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Fix Text
                      </motion.div>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={reset}
                    disabled={isLoading}
                    className="rounded-xl h-10 sm:h-11 border-gray-200 hover:bg-gray-50"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden h-full transition-shadow hover:shadow-xl">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <span>Corrected Version</span>
                  <AnimatePresence>
                    {correctedText && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800 font-normal"
                        >
                          {correctedText.length} characters
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600">
                  Properly formatted English text
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={correctedText}
                  readOnly
                  placeholder="Your corrected text will appear here..."
                  className="min-h-[200px] sm:min-h-[240px] resize-none rounded-xl bg-green-50/50 border-green-100 text-green-900 placeholder:text-green-700/50 transition-all"
                />
                <AnimatePresence>
                  {hasCorrection && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(correctedText)}
                        className="w-full rounded-xl h-10 sm:h-11 border-gray-200 hover:bg-gray-50 transition-all"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Corrected Text
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          className="mt-12 sm:mt-16 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg hover:border-blue-100"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              Smart Correction
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Works with both English and Hinglish text
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg hover:border-green-100"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              Natural Output
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Converts to proper English naturally
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg hover:border-purple-100"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              Instant Results
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Get corrections in real-time
            </p>
          </motion.div>
        </motion.div>
      </div>
      {/* Footer */}
      <motion.footer
        className="mt-16 border-t border-gray-100 py-8 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="text-center md:text-left space-y-2">
              <p className="text-sm text-gray-600">
                © 2025 GrammarAI. Developed by{" "}
                <a
                  href="https://karandev.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Karan
                </a>
              </p>
            </div>
            <div className="text-center md:text-right">
              <a
                href="https://promptpilot.infinitylinkage.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span>Try PromptPilot - Your AI Prompt Co-Pilot</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </motion.footer>
      <Toaster richColors position={isMobile ? "bottom-center" : "top-right"} />
    </motion.div>
  );
}

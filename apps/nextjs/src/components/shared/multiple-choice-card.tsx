import type { InputHTMLAttributes, MouseEvent } from "react";
import { forwardRef } from "react";

import { cn } from "@acme/ui";
import { Card, CardContent } from "@acme/ui/card";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";

interface MultipleChoiceCardProps
  extends InputHTMLAttributes<HTMLInputElement> {
  term: string;
  answers: string[];
  index: number;
  callback?: (index: number, event: MouseEvent<HTMLDivElement>) => void;
  definition?: string;
  userAnswer?: string;
}

const MultipleChoiceCard = forwardRef<
  HTMLInputElement,
  MultipleChoiceCardProps
>(
  (
    { index, term, answers, callback, userAnswer, definition, ...props },
    ref,
  ) => {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-1 flex-col sm:mb-12 sm:flex-row">
            <div className={`flex-1 pb-4`}>
              <span className="mb-6 block font-semibold text-muted-foreground">
                Term
              </span>
              <span className="text-2xl">{term}</span>
            </div>
          </div>
          {/* <div>
          {!result && <span className="mb-4 block">Choose answer</span>}
          {result && (
            <>
              {userAnswer === definition ? (
                <span className="mb-2 inline-block text-base font-medium">
                  You&apos;ve got this
                </span>
              ) : (
                <span className="mb-2 inline-block text-base font-medium">
                  You are still learning
                </span>
              )}
            </>
          )}
        </div> */}
          {!userAnswer && (
            <span className="mb-4 inline-block">Choose answer</span>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {answers.map((answer, answerIndex) => (
              <Label
                key={answerIndex}
                htmlFor={`card-${index}-choice-${answerIndex}`}
              >
                <span className="sr-only">{answer}</span>
                <Input
                  ref={ref}
                  id={`card-${index}-choice-${answerIndex}`}
                  name="multiple-choice"
                  type="radio"
                  className="peer hidden"
                  {...props}
                  value={answer}
                />
                <Card
                  onClick={(event) => callback && callback(answerIndex, event)}
                  className={cn(
                    "cursor-pointer border-2 peer-checked:border-blue-600 peer-checked:bg-blue-600/10",
                    {
                      "border-red-600 bg-red-600/10":
                        answer !== definition && userAnswer === answer,
                      "border-green-600 bg-green-600/10": answer === definition,
                    },
                  )}
                >
                  <CardContent className="p-4">{answer}</CardContent>
                </Card>
              </Label>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  },
);

MultipleChoiceCard.displayName = "MultipleChoiceCard";

export default MultipleChoiceCard;

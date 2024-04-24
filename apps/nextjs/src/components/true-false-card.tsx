import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@acme/ui";
import { Card, CardContent } from "@acme/ui/card";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";

interface TrueFalseCardProps extends InputHTMLAttributes<HTMLInputElement> {
  index: number;
  term: string;
  answer: string;
  definition?: string;
  userAnswer?: string;
}

const TrueFalseCard = forwardRef<HTMLInputElement, TrueFalseCardProps>(
  ({ term, answer, index, userAnswer, definition, ...props }, ref) => {
    return (
      <Card>
        <CardContent className="flex min-h-[30rem] flex-col p-6">
          <div className="flex flex-1 flex-col sm:mb-12 sm:flex-row">
            <div
              className={`flex-1 border-b-2 pb-4 sm:border-b-0 sm:border-r-2 sm:pb-0 sm:pr-6`}
            >
              <span className="mb-6 block font-semibold text-muted-foreground">
                Term
              </span>
              <span className="text-xl">{term}</span>
            </div>
            <div className="flex-1 pt-4 sm:pl-6 sm:pt-0">
              <span className="mb-6 block font-semibold text-muted-foreground">
                Definition
              </span>
              <span className="text-xl">{answer}</span>
            </div>
          </div>
          {!userAnswer && <span className="mb-4">Choose answer</span>}
          <div className="flex gap-4">
            <Label htmlFor={`true-false-${index}-true`} className="flex-1">
              <Input
                ref={ref}
                id={`true-false-${index}-true`}
                type="radio"
                name={`true-false-${index}`}
                className="peer hidden"
                {...props}
                value="true"
                disabled={!!userAnswer}
              />
              <Card
                className={cn(
                  "border-2 peer-checked:border-blue-600 peer-checked:bg-blue-600/10",
                  {
                    "border-red-600 bg-red-600/10":
                      answer !== definition && userAnswer === "true",
                    "border-green-600 bg-green-600/10":
                      answer === definition && userAnswer,
                  },
                )}
              >
                <CardContent className="p-4">True</CardContent>
              </Card>
            </Label>
            <Label htmlFor={`true-false-${index}-false`} className="flex-1">
              <Input
                ref={ref}
                id={`true-false-${index}-false`}
                type="radio"
                name={`true-false-${index}`}
                className="peer hidden"
                {...props}
                value="false"
                disabled={!!userAnswer}
              />
              <Card
                className={cn(
                  "border-2 peer-checked:border-blue-600 peer-checked:bg-blue-600/10",
                  {
                    "border-red-600 bg-red-600/10":
                      answer === definition && userAnswer === "false",
                    "border-green-600 bg-green-600/10":
                      answer !== definition && userAnswer,
                  },
                )}
              >
                <CardContent className="p-4">False</CardContent>
              </Card>
            </Label>
          </div>
        </CardContent>
      </Card>
    );
  },
);

TrueFalseCard.displayName = "TrueFalseCard";

export default TrueFalseCard;

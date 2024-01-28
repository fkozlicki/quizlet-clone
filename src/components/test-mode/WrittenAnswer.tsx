import { Alert, Card, Input, Typography } from "antd";
import type { Control, FieldPath } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import type { TestInputs } from "./TestForm";

interface WrittenAnswerProps {
  term: string;
  control?: Control<TestInputs>;
  name?: FieldPath<TestInputs>;
  result?: boolean;
  definition?: string;
  userAnswer?: string;
}

const WrittenAnswer = ({
  term,
  result,
  definition,
  userAnswer,
  control,
  name,
}: WrittenAnswerProps) => {
  return (
    <Card>
      <div className="flex min-h-[30rem] flex-col">
        <div className="flex flex-1 flex-col sm:mb-12 sm:flex-row">
          <div className={`flex-1 pb-4`}>
            <Typography.Text className="mb-6 block font-bold" type="secondary">
              Term
            </Typography.Text>
            <Typography.Text className="text-2xl">{term}</Typography.Text>
          </div>
        </div>
        <div>
          {!result && name && control && (
            <FormItem
              control={control}
              name={name}
              label="Your answer"
              className="mb-0"
            >
              <Input size="large" />
            </FormItem>
          )}
          {result && (
            <>
              {userAnswer !== definition ? (
                <>
                  <Typography.Text
                    className="mb-2 inline-block text-base font-medium"
                    type="danger"
                  >
                    You are still learning
                  </Typography.Text>
                  <Alert message={userAnswer} type="error" className="mb-6" />
                  <Typography.Text
                    type="secondary"
                    className="mb-2 inline-block text-base font-medium"
                  >
                    Correct answer
                  </Typography.Text>
                </>
              ) : (
                <Typography.Text type="success">
                  You&apos;ve got this
                </Typography.Text>
              )}
              <Alert message={definition} type="success" />
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default WrittenAnswer;

import { Card, Skeleton } from "antd";
import React from "react";

const StudySetSkeleton = () => {
  return (
    <Card>
      <Skeleton active title={false} className="mb-4" />
      <Skeleton.Avatar active size="small" />
    </Card>
  );
};

export default StudySetSkeleton;

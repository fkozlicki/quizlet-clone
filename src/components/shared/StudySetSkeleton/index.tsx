import { Card, Skeleton } from "antd";
import SkeletonAvatar from "antd/es/skeleton/Avatar";
import React from "react";

const StudySetSkeleton = () => {
  return (
    <Card>
      <Skeleton active title={false} className="mb-4" />
      <SkeletonAvatar active size="small" />
    </Card>
  );
};

export default StudySetSkeleton;

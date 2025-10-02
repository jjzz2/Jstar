import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "antd";
import { useRequest } from "ahooks";
import { getComponentStatService } from "../../../services/stat";
import { getComponentConfByType } from "../../../components/QuestionComponents";

const { Title } = Typography;

type PropsType = {
  selectedComponentId: string;
  selectedComponentType: string;
};

const ChartStat: FC<PropsType> = (props: PropsType) => {
  //这里父组件写明了子组件直接拿来用就可以了，不用在子组件中重新写明参数。这样的好处是其的属性统一由父组件进行管控，方便逻辑更改或添加
  const { selectedComponentId, selectedComponentType } = props;
  const { id = "" } = useParams();

  const [stat, setStat] = useState([]);
  //这里的数据是后端传递所得到的，通过后端传递过来的数据来进行渲染
  const { run } = useRequest(
    async (questionId, componentId) =>
      await getComponentStatService(questionId, componentId),
    {
      manual: true,
      onSuccess(res) {
        setStat(res.stat);
      },
    }
  );

  useEffect(() => {
    if (selectedComponentId) run(id, selectedComponentId);
  }, [id, selectedComponentId]);

  // 生成统计图表
  function genStatElem() {
    if (!selectedComponentId) return <div>未选中组件</div>;

    const { StatComponent } =
      getComponentConfByType(selectedComponentType) || {};
    if (StatComponent == null) return <div>该组件无统计图表</div>;

    return <StatComponent stat={stat} />;
  }

  return (
    <>
      <Title level={3}>图表统计</Title>
      <div>{genStatElem()}</div>
    </>
  );
};

export default ChartStat;

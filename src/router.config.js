import Project from '@/project/Index';
import createProject from '@/project/Create';
import Problem from '@/problem/Index';
import Overview from '@/project/Overview';
import ConfigurationOfTheDetectorConfiguration from '@/tester/ConfigurationOfTheDetectorConfiguration';
import RuleConfiguration from '@/tester/RuleConfiguration';

export default [
  {
    path: "/project",
    component: Project,
    componentName: "项目列表",
    iconName: 'mail',
    routes: [
      {
        path: "/create",
        component: createProject,
        componentName: "新建项目"
      },
      {
        path: "/:projectId/overview",
        component: Overview,
        componentName: "项目总览"
      }
    ]
  },
  {
    path: "/problem",
    component: Problem,
    componentName: "问题列表",
    iconName: 'mail'
  },
  {
    path: "/tester",
    component: ConfigurationOfTheDetectorConfiguration,
    componentName: "检测器配置的配置",
    iconName: 'mail',
    routes: [
      {
        path: "/detector",
        component: ConfigurationOfTheDetectorConfiguration,
        componentName: "检测器配置的配置",
      },
      {
        path: "/rule",
        component: RuleConfiguration,
        componentName: "规则配置",
      },
    ]
  }
];
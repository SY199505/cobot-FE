import Project from '@/project/Index';
import createProject from '@/project/Create';
import Problem from '@/problem/Index';

export default [
  // {
  //   path: "/",
  //   component: Project,
  //   iconName: 'mail'
  // },
  {
    path: "/project",
    component: Project,
    iconName: 'mail',
    routes: [
      {
        path: "/create",
        component: createProject
      }
    ]
  },
  {
    path: "/problem",
    component: Problem,
    iconName: 'mail'
  },
];
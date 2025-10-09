import type { DashboardLayout } from "../DashbiardExampleProps";

type Node = {
  code: string;
  children?: Node[];
};

export const buildPaths = (nodes: Node[]) => {
  const paths: string[] = [];

  for (const node of nodes) {
    if (node.code) {
      //   for (const child of node.children) {
      paths.push(`${node.code}/`);
      //   }
    }
  }

  return paths;
};

export function mergeDashboard(
  array: DashboardLayout[],
  newItem: DashboardLayout
) {
  const index = array.findIndex((item) => item.id === newItem.id);

  if (index !== -1) {
    // Replace existing dashboard
    array[index] = newItem;
  } else {
    // Add new dashboard
    array.push(newItem);
  }

  return array;
}

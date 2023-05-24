<template>
	<div class="system-menu-container layout-pd">
		<el-card shadow="hover">
			<div class="system-menu-search mb15">
				<el-input size="default" placeholder="请输入工作空间名称" style="max-width: 180px"> </el-input>
				<el-button size="default" type="primary" class="ml10" @click="getTableData">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
			</div>
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%" row-key="uuid"
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }">				
				<el-table-column label="序号" show-overflow-tooltip width="80">
					<template #default="scope">
						{{ scope.$index }}
					</template>
				</el-table-column>
				<el-table-column prop="uuid" label="工作空间ID" show-overflow-tooltip></el-table-column>
				<el-table-column label="模板名称" show-overflow-tooltip>
					<template #default="scope">
						<span class="ml10">{{ $t(scope.row.name) }}</span>
					</template>
				</el-table-column>
				<el-table-column label="描述信息" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ scope.row.info }}</span>
					</template>
				</el-table-column>
				<el-table-column label="镜像信息" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ scope.row.image.name }}:{{ scope.row.image.version }}</span>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ scope.row.createTime }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" show-overflow-tooltip width="200">
					<template #default="scope">
						<el-button size="small" text type="primary">创建空间</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<MenuDialog ref="menuDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="workspace">
import { onMounted, reactive } from 'vue'
import { workspaceQuery } from '/@/api/apollo/workspace'
import gql from 'graphql-tag'
import { debug } from 'console';

// 定义变量内容
const state = reactive({
	tableData: {
		data: [] as any[],
		loading: true,
	},
});

// 获取路由数据，真实请从接口获取
const getTableData = () => {

	state.tableData.loading = true;

	let _timestamp: string = new Date().getTime() + "";

	workspaceQuery(gql`
      query WorksapceTemplate {
        systemTemplates {
			uuid,
			name,
			info,
			createTime,
			image {
				uuid,
				name,
				version
			}
    	}
      }
    `, null,
		{
			fetchPolicy: "network-only"
		})
		.onResult(e => {
			state.tableData.data = e?.data?.systemTemplates;

			setTimeout(() => {
				state.tableData.loading = false;
			}, 500);
		});


};
// 页面加载时
onMounted(() => {
	getTableData();
});
</script>

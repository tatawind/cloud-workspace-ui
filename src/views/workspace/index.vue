<template>
	<div class="system-menu-container layout-pd">
		<el-card shadow="hover">
			<div class="system-menu-search mb15">
				<el-input v-model="state.tableData.params.search" size="default" placeholder="请输入工作空间名称"
					style="max-width: 180px"> </el-input>
				<el-button size="default" type="primary" class="ml10" @click="onQueryWorkspace()">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增工作空间
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
				<el-table-column label="工作空间名称" show-overflow-tooltip>
					<template #default="scope">
						<span class="ml10">{{ $t(scope.row.name) }}</span>
					</template>
				</el-table-column>
				<el-table-column label="归属人" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ scope.row.ownerId }}</span>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ scope.row.createTime }}</span>
					</template>
				</el-table-column>
				<el-table-column label="状态" show-overflow-tooltip width="80">
					<template #default="scope">
						<el-tag type="success" size="small">{{ scope.row.status }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" show-overflow-tooltip width="200">
					<template #default="scope">
						<el-button size="small" text type="primary">打开IDE</el-button>
						<el-button size="small" text type="primary">关闭</el-button>
						<el-button size="small" text type="primary">释放</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script setup lang="ts" name="workspace">
import { onMounted, onActivated, reactive } from 'vue'
import { workspaceQuery } from '/@/api/apollo/workspace'
import gql from 'graphql-tag'

// 定义变量内容
const state = reactive({
	tableData: {
		params: {
			search: ""
		},
		data: [] as any[],
		loading: true,
	},
});

// 获取路由数据，真实请从接口获取
const queryWorkspace = () => {

	state.tableData.loading = true;

	const { onResult } = workspaceQuery(gql`
      query Worksapces {
        workspaces {
    		uuid
            ownerId
            name
			status
            createTime
  		}
      }
    `, null,
		{
			fetchPolicy: "no-cache"
		});

	return {
		onResult
	}
};

const onQueryWorkspace = () => {
	let data = queryWorkspace();
	data.onResult(e => {
		state.tableData.data = e?.data?.workspaces;
		
		setTimeout(() => {
			state.tableData.loading = e?.loading;
		}, 500);

	});

}

// 页面加载时
onActivated(() => {
	onQueryWorkspace();
});
</script>

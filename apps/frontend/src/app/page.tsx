'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Input, Modal, Form, Space, Popconfirm, message } from 'antd';

const API_URL = 'http://localhost:8000';

export default function Page() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async (values: any) => {
    try {
      await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      message.success('Task added');
      setIsModalVisible(false);
      form.resetFields();
      fetchTasks();
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleEdit = async (values: any) => {
    if (editingTaskId === null) return;
    try {
      await fetch(`${API_URL}/tasks/${editingTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      message.success('Task updated');
      setIsModalVisible(false);
      setEditingTaskId(null);
      form.resetFields();
      fetchTasks();
    } catch (err) {
      console.error('Failed to edit task:', err);
    }
  };

  // ✅ Add handleDelete back
  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      message.success('Task deleted');
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
      message.error('Failed to delete task');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Task Dashboard</h1>
      <Button
        type="primary"
        onClick={() => {
          form.resetFields();
          setEditingTaskId(null);
          setIsModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Add Task
      </Button>

      <Table
        loading={loading}
        dataSource={tasks}
        columns={[
          { title: 'Task', dataIndex: 'task', key: 'task' },
          { title: 'Status', dataIndex: 'status', key: 'status' },
          {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
              <Space>
                <Button
                  type="link"
                  onClick={() => {
                    form.setFieldsValue(record);
                    setEditingTaskId(record.id);
                    setIsModalVisible(true);
                  }}
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Are you sure you want to delete this task?"
                  onConfirm={() => handleDelete(record.id)} // ✅ Now works
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger type="link">
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
        rowKey="id"
      />

      <Modal
        title={editingTaskId ? 'Edit Task' : 'Add Task'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              if (editingTaskId) {
                handleEdit(values);
              } else {
                handleAdd(values);
              }
            })
            .catch(() => {});
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="task"
            label="Task"
            rules={[{ required: true, message: 'Please input the task!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please input the status!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

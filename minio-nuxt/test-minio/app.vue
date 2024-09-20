<template>
  <div>
    <table>
      <tbody>
        <tr>
          <td>
            <select @change="setBucket()" v-model="bucket">
              <option v-for="bucket in listBucketEle" :value="bucket.name">{{ bucket.name }}</option>
            </select>
          </td>
          <td>
            <button @click="listObjs()">List objects</button>
          </td>
        </tr>
        <tr>
          <td>
            <input type="file" id="fileItem">
          </td>
          <td>
            <button id="upload-btn" @click="uploadFile()">Upload file</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div id="list-obj">
    <table>
      <thead>
        <tr>
          <th>File Name</th>
          <th>Modified date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="obj in listObjEle">
          <td><a href="#">{{ obj.name }}</a></td>
          <td>{{ obj.lastModified }}</td>
          <td>
            <button @click="downloadFile(obj.name)">Download</button>
            <button @click="deleteFile(obj.name)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const listBucketEle = ref([]);
const listObjEle = ref([]);
const bucket = ref('owncloud');

onMounted(async () => {
  await listBuckets();
})

const listBuckets = async () => {
  const response = await fetch('http://localhost:3001/listBuckets');
  const data = await response.json();
  listBucketEle.value = data.data
}

const setBucket = () => {
  console.log(bucket.value);
}

const listObjs = async () => {
    const response = await fetch('http://localhost:3001/listObjs?bucket=' + bucket.value);
    const data = await response.json();
    listObjEle.value = data.data;
}

const uploadFile = async () => {
    const file = document.getElementById("fileItem").files[0]
    if (!file)
      alert('no file chosen!');
    else {
      const formData = new FormData();
      formData.append("bucket", bucket.value);
      formData.append("file", file);
      const response = await fetch('http://localhost:3001/upload', {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      alert('sucess!');
    }
}

const downloadFile = async (fileName) => {
  try {
    const response = await fetch(`http://localhost:3001/download?fileName=${fileName}&bucket=${bucket.value}`);
    const data = await response.blob();
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url); 
  } catch (error) {
    console.log(error);
    alert('failed!');
  }
}

const deleteFile = async (fileName) => {
  try {
    const response = await fetch(`http://localhost:3001/delete`, {
      method: "POST",
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      }, 
      body:  new URLSearchParams({
        'fileName': fileName,
        'bucket': bucket.value,
      })
    }); 
    const data = await response.json();
    alert('success');
  } catch (error) {
    console.log(error);
    alert('failed!');
  }
}
</script>

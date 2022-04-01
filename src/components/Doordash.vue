<template>
  <div class="container">
    <h3>Doordash</h3>
    <form action="">
      <input type="file" id="CSV" accept=".csv" @change="onFileChange" />
      <input type="submit" @click.prevent="loadCSV" />
      <input type="button" value="Print Form" @click.prevent="window.print()" />
    </form>
    <table>
      <tr>
        <th>Date</th>
        <th>Sale Amount</th>
      </tr>
      <tr v-for="data in state.loadedData" :key="data.date">
        <td>{{ data.date }}</td>
        <td>{{ data.netSale }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { reactive, onUpdated } from "vue";
import Papa from "papaparse";
export default {
  setup() {
    const state = reactive({
      loadedData: [],
    });
    const onFileChange = (e) => {
      const file = e.target.files[0];
      Papa.parse(file, {
        header: true,
        complete: function(results) {
          //   console.log(results.data);
          sortRequiredData(results.data);
        },
      });
      const sortRequiredData = (data) => {
        data.forEach((element) => {
          const transaction = {
            date: element.TIMESTAMP_UTC_DATE,
            netSale: element.CREDIT,
          };
          state.loadedData.push(transaction);
          console.log(transaction);
        });
      };
    };
    return { onFileChange, state };
  },
};
</script>

<style scoped></style>

<template>
  <div class="container">
    <!-- <label for="CSV">Upload CSV file</label> -->
    <form action="">
      <input type="file" id="CSV" accept=".csv" @change="onFileChange" />
      <input type="submit" @click.prevent="loadCSV" />
    </form>
    <table v-for="transaction in state.loadedData" :key="transaction.cardName">
      <tr>
        <th>{{ transaction.cardName }}</th>
      </tr>
      <tr></tr>
    </table>
  </div>
</template>

<script>
import { reactive } from "vue";
import Papa from "papaparse";
export default {
  name: "App",
  components: {},
  setup() {
    const state = reactive({
      loadedData: [],
    });
    const onFileChange = (e) => {
      const file = e.target.files[0];
      Papa.parse(file, {
        header: true,
        complete: function(results) {
          console.log(results.data);
          sortRequiredData(results.data);
        },
      });
      const sortRequiredData = (data) => {
        data.forEach((element) => {
          const transaction = {
            cardName: element["Card Brand"],
            netSale: parseFloat(element["Net Sales"].replace(/\$|,/g, "")),
            tax: parseFloat(element.Tax.replace(/\$|,/g, "")),
            total: netSalePlusTax(
              parseFloat(element["Net Sales"].replace(/\$|,/g, "")),
              parseFloat(element.Tax.replace(/\$|,/g, ""))
            ),
          };
          state.loadedData.push(transaction);
          console.log(transaction);
        });
      };
      const netSalePlusTax = (a, b) => {
        return a + b;
      };
    };
    return { state, onFileChange };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<template>
  <!-- Square app monthly profit summary -->
  <div class="container">
    <h3>Square app</h3>
    <!-- <label for="CSV">Upload CSV file</label> -->
    <form action="">
      <input type="file" id="CSV" accept=".csv" @change="onFileChange" />
      <input type="submit" @click.prevent="loadCSV" />
      <input type="button" value="Print Form" @click.prevent="window.print()" />
    </form>

    <table>
      <tr>
        <th>Date</th>
        <th>Visa</th>
        <th>Master Card</th>
        <th>Amex</th>
        <th>Discover</th>
      </tr>
      <tr v-for="transaction in state.groupedDates" :key="transaction.date">
        <td>{{ transaction.date }}</td>
        <td>{{ transaction.dayVisa }}</td>
        <td>{{ transaction.dayMasterCard }}</td>
        <td>{{ transaction.dayAmex }}</td>
        <td>{{ transaction.dayDiscover }}</td>
      </tr>
    </table>

    <table>
      <tr>
        <th>Grand Total:</th>

        <th>Visa Total:</th>
        <th>MasterCard Total:</th>
        <th>AMEX Total:</th>
        <th>Discover Total:</th>
      </tr>
      <tr>
        <td>
          $
          {{
            (
              state.visa +
              state.amex +
              state.masterCard +
              state.discover
            ).toFixed(2)
          }}
        </td>
        <td>${{ state.visa.toFixed(2) }}</td>
        <td>${{ state.masterCard.toFixed(2) }}</td>
        <td>${{ state.amex.toFixed(2) }}</td>
        <td>${{ state.discover.toFixed(2) }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { reactive } from "vue";
import Papa from "papaparse";
import { useStore } from "vuex";

const CARD_KEY = {
  Visa: "visa",
  MasterCard: "masterCard",
  "American Express": "amex",
  Discover: "discover",
};

const parseMoney = (value) => {
  const n = parseFloat(String(value ?? "").replace(/[$,]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

export default {
  name: "App",
  components: {},
  setup() {
    const state = reactive({
      visa: 0,
      amex: 0,
      masterCard: 0,
      discover: 0,
      groupedDates: null,
    });
    const store = useStore();

    const reset = () => {
      state.visa = 0;
      state.amex = 0;
      state.masterCard = 0;
      state.discover = 0;
      state.groupedDates = null;
    };

    const aggregate = (rows) => {
      const byDate = new Map();

      for (const row of rows) {
        const cardKey = CARD_KEY[row["Card Brand"]];
        if (!cardKey || !row.Date) continue;

        const total = parseMoney(row["Net Sales"]) + parseMoney(row.Tax);
        state[cardKey] += total;

        if (!byDate.has(row.Date)) {
          byDate.set(row.Date, { visa: 0, masterCard: 0, amex: 0, discover: 0 });
        }
        byDate.get(row.Date)[cardKey] += total;
      }

      return Array.from(byDate, ([date, totals]) => ({
        date,
        dayVisa: totals.visa.toFixed(2),
        dayMasterCard: totals.masterCard.toFixed(2),
        dayAmex: totals.amex.toFixed(2),
        dayDiscover: totals.discover.toFixed(2),
      }));
    };

    const onFileChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      reset();
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: ({ data }) => {
          state.groupedDates = aggregate(data);
          store.commit("updateSquare", state.groupedDates);
        },
      });
    };

    return { state, onFileChange };
  },
};
</script>

<style scoped>
table {
  border: 1px solid black;
  width: 100%;
  text-align: center;
  font-size: 1.3rem;
}
tr {
  border: 1px solid black;
}
/* td {
  border-bottom: 1px solid black;
} */
tr:nth-child(odd) {
}
</style>

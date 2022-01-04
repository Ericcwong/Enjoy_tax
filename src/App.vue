<template>
  <div class="container">
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
      <tr v-for="transaction in state.groupedDates" :key="transaction.cardName">
        <td @change="totalCredit">{{ transaction.date }}</td>
        <td>{{ transaction.dayVisa }}</td>
        <td>{{ transaction.dayAmex }}</td>
        <td>{{ transaction.dayMasterCard }}</td>
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
import { reactive, onUpdated } from "vue";
import Papa from "papaparse";
export default {
  name: "App",
  components: {},
  setup() {
    const state = reactive({
      loadedData: [],
      visa: 0,
      amex: 0,
      masterCard: 0,
      discover: 0,
      groupedDates: null,
    });
    const onFileChange = (e) => {
      const file = e.target.files[0];
      Papa.parse(file, {
        header: true,
        complete: function(results) {
          // console.log(results.data);
          sortRequiredData(results.data);
          totalCredit();
          daySort();
        },
      });
      const sortRequiredData = (data) => {
        data.forEach((element) => {
          const transaction = {
            date: element.Date,
            cardName: element["Card Brand"],
            netSale: element["Net Sales"],
            tax: element.Tax,
            total: netSalePlusTax(element["Net Sales"], element.Tax),
          };
          state.loadedData.push(transaction);
          console.log(transaction);
        });
      };
      const netSalePlusTax = (a, b) => {
        if (a && b != undefined) {
          let priceOne = a.replace("$", "");
          let priceTwo = b.replace("$", "");
          return (parseFloat(priceOne) + parseFloat(priceTwo)).toFixed(2);
        } else {
          return;
        }
      };

      const totalCredit = async () => {
        let cardName = await state.loadedData;
        cardName.forEach((element) => {
          switch (element.cardName) {
            case "Visa":
              // console.log(element.total);
              state.visa = state.visa + parseFloat(element.total);
          }
          switch (element.cardName) {
            case "American Express":
              // console.log(element.total);
              state.amex = state.amex + parseFloat(element.total);
          }
          switch (element.cardName) {
            case "MasterCard":
              // console.log(element.total);
              state.masterCard = state.masterCard + parseFloat(element.total);
          }
          switch (element.cardName) {
            case "Discover":
              // console.log(element.total);
              state.discover = state.discover + parseFloat(element.total);
          }
        });
      };
    };
    const daySort = () => {
      const groups = state.loadedData.reduce((groups, day) => {
        const date = day.date;
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(day);
        return groups;
      }, {});

      // Edit: to add it in the array format instead
      const groupArrays = Object.keys(groups).map((date) => {
        let cardName = groups[date];
        let dayVisa = 0;
        let dayAmex = 0;
        let dayMasterCard = 0;
        let dayDiscover = 0;

        cardName.forEach((element) => {
          switch (element.cardName) {
            case "Visa":
              dayVisa = dayVisa + parseFloat(element.total);
          }
          switch (element.cardName) {
            case "American Express":
              dayAmex = dayAmex + parseFloat(element.total);
          }
          switch (element.cardName) {
            case "MasterCard":
              dayMasterCard = dayMasterCard + parseFloat(element.total);
          }
          switch (element.cardName) {
            case "Discover":
              dayDiscover = dayDiscover + parseFloat(element.total);
          }
        });

        return {
          date,
          days: groups[date],
          dayVisa: dayVisa.toFixed(2),
          dayAmex: dayAmex.toFixed(2),
          dayMasterCard: dayMasterCard.toFixed(2),
          dayDiscover: dayDiscover.toFixed(2),
        };
      });
      state.groupedDates = groupArrays;
      console.log(groups);
      console.log(groupArrays);
    };

    return { state, onFileChange };
  },
};
</script>

<style>
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

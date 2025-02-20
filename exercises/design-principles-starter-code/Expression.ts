// 1. What design principles does this code violate?
//		I think that it violates in some way the High-Quality Abstraction principle. It could do more to abstract the numbers that it is using for comparison in order to make it more clear what those numbers mean.
//		I also think that it is not really following the Isolated Change Principle. If any of those numbers that are hard-coded change (and are used later on), we would have to change all the numbers through all the code instead of making one change that takes effect through the whole code.
//
// 2. Refactor the code to improve its design.

function isLowRiskClient(
    score: number,
    income: number,
    authorized: boolean
): boolean {
    let goodScore: number = 700;
    let minScore: number = 500;
    let lowerIncomeLimit: number = 40000;
    let higherIncomeLimit: number = 100_000;

    if (
        !(
            score > goodScore ||
            (income >= lowerIncomeLimit &&
                income <= higherIncomeLimit &&
                authorized &&
                score > minScore) ||
            income > higherIncomeLimit
        )
    ) {
        return false;
    } else {
        return true;
    }
}

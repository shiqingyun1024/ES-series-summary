class A {
    mergeSort(arr, assets) {
        if (arr.length <= 1) {
            return arr;
        }
        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid);

        return this.merge(
            this.mergeSort(left, assets),
            this.mergeSort(right, assets),
            assets
        )
    }
    merge(left, right, assets) {
        let i = 0;
        let j = 0;
        const result = [];

        while (i < left.length && j < right.length) {
            const sizeA = assets[left[i]].match(/[(.*)]/)[1].size();
            const sizeB = assets[right[j]].match(/[(.*)]/)[1].size();

            if (sizeA <= sizeB) {
                result.push(left[i]);
                i++;
            } else {
                result.push(right[j]);
                j++;
            }
        }

        while (i < left.length) {
            result.push(left[i])
            i++;
        }

        while (j < right.length) {
            result.push(left[i])
            j++;
        }

        return result;
    }

}

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
import scipy.stats as stats
from datetime import datetime

# preprocess_data - כל הפונקציות מקבלות את מה שחוזר מהפונקציה

def preprocess_data(data):
    """
    Performs preprocessing steps on the calibration data.

    Args:
        data: pandas DataFrame containing data

    Returns:
        pandas.DataFrame: The preprocessed DataFrame.
    """

    # 1. Data Loading

    # 2. Identifier Cleaning
    data['identifier'] = data['identifier'].str.strip()
    data['identifier'] = data['identifier'].replace('', np.nan)
    data['identifier'] = data['identifier'].replace(np.nan, "not provided")

    # 3. Date Feature Engineering
    data['measurement_date'] = pd.to_datetime(data['measurement_date'])
    data['date_value'] = data.groupby(['serial_number', 'identifier'])['measurement_date'].transform(
        lambda x: (pd.to_datetime(x) - pd.to_datetime(x).min()).dt.days / 365 + 1)

    filtered_df = (data.groupby(["serial_number", "identifier", "input_value"]).filter(lambda x: len(x) > 2))
    data = filtered_df

    return data

# חיזוי - ריגרסיה ליניארית
# data - table מדידות
# calibration - table מדידות , serial number , input_value
# calibration_for_subset - callback

def calibration_for_subset(subset, to_plot=False, serial_number=None, input_value=None):
    """
    Performs a weighted linear regression calibration on a dataset.

    This function takes a pandas DataFrame containing measurement data, converts the measurement dates to a datetime format,
    computes the elapsed time in years since the first measurement, and then fits a weighted linear regression model to
    estimate the relationship between time (in years) and the deviation. Additionally, the function computes uncertainty
    estimates for the regression parameters, evaluates the goodness-of-fit using a chi-square test, and optionally produces a plot.

    Parameters
    ----------
    subset : pandas.DataFrame
        A DataFrame that must include the following columns:
          - 'measurement_date': Dates of the measurements. These will be converted to datetime format.
          - 'deviation': The dependent variable representing the deviation for each measurement.
          - 'uncertainty': The uncertainty associated with each measurement; weights for the regression are computed as 1/uncertainty.
    to_plot : bool, optional
        If True, the function will generate a plot displaying the data points, the fitted regression line, and annotations
        showing key regression statistics (default is False).

    Returns
    -------
    dict
        A dictionary containing the following calibration results:
          - 'a': Intercept of the fitted regression model.
          - 'b': Slope of the fitted regression model.
          - 'u2a': Squared uncertainty of the intercept (a).
          - 'u2b': Squared uncertainty of the slope (b).
          - 'cov(a,b)': Covariance between the intercept and slope.
          - 'chi2_stat': Chi-square statistic computed from the weighted residuals.
          - 'n': Number of observations used in the calibration.
          - 'df': Degrees of freedom (n - 2).
          - 'chi2_quantil_95': The 95th percentile (critical value) from the chi-square distribution with the corresponding degrees of freedom.
          - 'status': A string indicating the outcome of the chi-square test ("passed" if the statistic is below the 95th percentile, otherwise "rejected").

    Notes
    -----
    - The elapsed time in years is computed as:
          (days since first measurement) / 365 + 1
      The addition of 1 is based on a method used in an external reference ("Amit excel").
    - The regression is weighted using the inverse of the measurement uncertainties.
    - Uncertainty estimates for the intercept and slope, as well as their covariance, are calculated following the method
      described on page 18 of the referenced book.
    - A chi-square test is performed where the computed chi-square statistic is compared against the 95th percentile of the
      chi-square distribution (with degrees of freedom equal to the number of observations minus 2). If the statistic is lower,
      the calibration is considered acceptable ("passed").
      """
    subset = subset.sort_values("date_value")
    subset['uncertainty'] = pd.to_numeric(subset['uncertainty'], errors='coerce')
    subset['deviation'] = pd.to_numeric(subset['deviation'], errors='coerce')
    subset['date_value'] = pd.to_numeric(subset['date_value'], errors='coerce')
    subset = subset.dropna(subset=['uncertainty', 'deviation', 'date_value'])
    subset = subset.sort_values("date_value")

    # Prepare the independent variable (X) and dependent variable (y)
    X = subset[["date_value"]]  # scikit-learn expects a 2D array for features
    y = subset['deviation']
    w = 1 / subset['uncertainty']

    # Fit a linear regression model
    model = LinearRegression()
    model.fit(X, y, sample_weight=w)
    y_pred = model.predict(X)

    # Get model parameters: a is the intercept, b is the slope
    a = model.intercept_
    b = model.coef_[0]

    # Calculate R^2
    r2 = r2_score(y, y_pred)

    # caluclate uncertaities for a, b as in the book page 18
    x = X.squeeze()
    w_squared = w ** 2
    F_squared = sum(w_squared)
    g0 = 1 / F_squared * sum(w_squared * x)
    g = w * (x - g0)
    G_squared = sum(g ** 2)
    try:
        uncertainty_squared_a = 1 / F_squared + g0 ** 2 / G_squared
    except:
        print(subset)
        print(f"x: {x}")
        print(f"w^2: {w_squared}")
        print(f"F squred:{F_squared}")
        print(f"g0: {g0}")
        print(f"g: {g}")
        print(f"g^2: {g ** 2}")
        print(f"G squred:{G_squared}")
        input()

    uncertainty_squared_b = 1 / G_squared
    cov_ab = -g0 / G_squared

    # for validation
    r = w * (y - (a + b * x))
    chi2_stat = sum(r ** 2)
    df = len(subset) - 2
    print("work......")

    # Compute the quantile (critical value) for the chi-square distribution
    quantile_95 = stats.chi2.ppf(0.95, df) if df > 0 else 1 # NEED TO CHANGE - YONIT
  # todo: 0.05 or 0.95?
    did_pass = chi2_stat < quantile_95

    if to_plot:
        # Plot the original data points
        plt.figure(figsize=(10, 6))
        plt.scatter(subset['date_value'], subset['deviation'], color='blue', label='Data Points')

        # Plot the best fit line
        plt.plot(subset['date_value'], y_pred, color='red', label='Best Fit Line')

        # Labeling the plot
        plt.xlabel('Years Since First Measurement')
        plt.ylabel('Deviation')
        plt.title('Deviation Over Time with Best Fit Line')
        plt.legend()

        print("work......")
        # Annotate the plot with the R^2 value, intercept (a), and slope (b)
        plt.text(0.05, 0.95, f'$R^2 = {r2:.3f}$', transform=plt.gca().transAxes,
                 fontsize=12, verticalalignment='top')
        plt.text(0.05, 0.90, f'$a = {a:.5f}$', transform=plt.gca().transAxes,
                 fontsize=12, verticalalignment='top')
        plt.text(0.05, 0.85, f'$b = {b:.5f}$', transform=plt.gca().transAxes,
                 fontsize=12, verticalalignment='top')
        plt.text(0.05, 0.80, f'$u^2(a) = {uncertainty_squared_a:.10f}$', transform=plt.gca().transAxes,
                 fontsize=12, verticalalignment='top')
        plt.text(0.05, 0.75, f'$u^2(b) = {uncertainty_squared_b:.10f}$', transform=plt.gca().transAxes,
                 fontsize=12, verticalalignment='top')
        plt.text(0.05, 0.70, f'$cov(a,b) = {cov_ab:.10f}$', transform=plt.gca().transAxes,
                 fontsize=12, verticalalignment='top')
        plt.text(0.05, 0.65, f'$X^2 = {chi2_stat:.3f} < {quantile_95:.3f}, {"pass" if did_pass else "rejected"}$',
                 transform=plt.gca().transAxes,
                 fontsize=12, verticalalignment='top')
        print("work......")
        plt.savefig(f"lin_reg_serial_number={serial_number}_input_value={input_value}.png")
        plt.close()
    
    # return {"a": a, "b": b, "u2a": uncertainty_squared_a, "cov(a,b)": cov_ab,
    #         "chi2_stat": chi2_stat, "n": len(subset), "df": df, "status": "passed" if did_pass else "rejected", "R2": r2}
    
    # ValueError: Out of range float values are not JSON compliant FROM this feild *****"chi2_quantil_95": quantile_95,*****
    return {"a": a, "b": b, "u2a": uncertainty_squared_a, "u2b": uncertainty_squared_b, "cov(a,b)": cov_ab,
            "chi2_stat": chi2_stat, "n": len(subset), "df": df, "chi2_quantil_95": quantile_95,
            "status": "passed" if did_pass else "rejected", "R2": r2}

def calibration(data, serial_number, input_value, to_plot=False):
    print("Data --------", data)
    subset = data[
        (data["serial_number"].astype(str) == str(serial_number)) &
        (pd.to_numeric(data["input_value"], errors="coerce") == float(input_value))
    ]
    print("Subset--------", subset)
    return calibration_for_subset(subset, to_plot=to_plot, serial_number=serial_number, input_value=input_value)


# def apply_calibration_for_all(data):
#     results = data.groupby(['serial_number', 'input_value'], dropna=True).apply(calibration_for_subset)
#     results = pd.DataFrame.from_records(results, index=results.index)
#     return results


# חישוב אי וודאות
# predict_uncertainty
# predict_uncertainty_for_subset - callback

def predict_uncertainty_for_subset(subset, query_date, query_value, k=6):
    if subset.empty:
        print("cannot calculate knn since there are no observations with same serial_number and same identifier")
        return None

    num_observations = len(subset)
    if num_observations < k:
        print(
            f"have only {num_observations} observations with same serial number and identifier, reducing to {num_observations}-nn")
        k = num_observations

    # Make a copy to avoid modifying the original DataFrame
    subset = subset.copy()

    subset["uncertainty"] /= 2

    if not isinstance(query_date, datetime):
        query_date = datetime.strptime(query_date,"%d/%m/%Y" )
    query_date_value = (query_date - min(subset["measurement_date"])).days / 365 + 1
    # Calculate Euclidean distance in the (date, input_value) space.
    subset['distance'] = np.sqrt((subset["date_value"] - query_date_value) ** 2 + (subset['input_value'] - query_value) ** 2)

    # Sort the subset by distance and take the k nearest neighbors
    nearest = subset.sort_values('distance').head(k)

    # Compute weights as the inverse of the distance
    weights = 1 / nearest['distance']

    # Normalize the weights so they sum to 1
    weights_normalized = weights / weights.sum()

    # Compute u_predStandard as the weighted sum of uncertainties
    u_predStandard = np.sum(weights_normalized * nearest['uncertainty'])

    nearest = nearest[["uncertainty"]]

    nearest["df"] = 1000  # constant from the model
    nearest.loc[-1] = [u_predStandard, k - 1]  # add the row for the predicted value and its df
    EffictiveDF = (sum(nearest["uncertainty"] ** 2)) ** 2 / (sum(nearest["uncertainty"] ** 4 / nearest["df"]))
    alpha = 1 - 0.9545  # from Amit's excel
    k_factor = stats.t.ppf(1 - alpha / 2, EffictiveDF)
    uncertainty_extended_prediction = u_predStandard * k_factor

    return {"u_predStandard": u_predStandard, "EffictiveDF": EffictiveDF,
            "uncertainty_extended_prediction": uncertainty_extended_prediction}


def predict_uncertainty(data, serial_number, identifier, query_date, query_value, k=6):
    # Subset the dataframe to only rows with the matching serial_number and identifier
    subset = data[(data['serial_number'] == serial_number) & (data['identifier'] == identifier)]
    return predict_uncertainty_for_subset(subset, query_date, query_value, k)


# def predict_uncertainty_for_all(data,  query_date, query_value, k=6):
#     def predict_uncertainty_for_subset_helper(subset):
#         return predict_uncertainty_for_subset(subset, query_date, query_value, k)
#     res = data.groupby(["serial_number", "identifier"]).apply(predict_uncertainty_for_subset_helper)
#     res = pd.DataFrame.from_records(res, columns=list(res.iloc[0].keys()), index=res.index)

#     return res


def find_calibration_interval_for_subset(subset, risk_factor):
  intervals = []
  for query_value in subset["input_value"].unique():
    subset_with_input_value = subset[subset["input_value"]==query_value]
    linear_reg_results = calibration_for_subset(subset_with_input_value)
    uncertainty_results = predict_uncertainty_for_subset(subset, query_date=datetime.today(), query_value=query_value, k=5)
    unc = uncertainty_results['uncertainty_extended_prediction']
    tolerance =  subset[subset["input_value"]==query_value]["tolerance"].to_numpy()[0]

    a, b = linear_reg_results["a"], linear_reg_results["b"]
    subset_dates_values_for_that_input = subset_with_input_value["date_value"].sort_values().values

    if b==0:
      next_calibration_time = subset_dates_values_for_that_input[-1] + (subset_dates_values_for_that_input[-1] - subset_dates_values_for_that_input[-2])
      # no info from regression, assume that we should calibrate after last intervall from last measurement


    elif b>0:
      next_calibration_time = (tolerance + risk_factor * unc - a) / b  # find x such that bx+a + A*unc >= threshold
    else:
      # b<0, find x such that |bx+a + A*unc| >= threshold
      # rsquare both sides and aply root theorem
      A = b ** 2
      B = 2 * b * (a + risk_factor * unc)
      C = (a + risk_factor * unc) ** 2 - tolerance ** 2
      next_calibration_time = (-B + (B ** 2 - 4 * A * C) ** 0.5) / (2*A)
    #  next_calibration_time = (-(tolerance + risk_factor*unc) - a)/b # find x such that bx+a + A*unc <= -threshold

    interval = next_calibration_time - max(subset_dates_values_for_that_input)
    intervals.append(interval)

  calibration_interval = min(intervals)
  return calibration_interval

# חיזוי מרווח כיול
# find_calibration_interval
# find_calibration_interval_for_subset - callback
# output - time

def find_calibration_interval(data, serial_number, identifier, risk_factor):

  subset = data[(data['serial_number']==serial_number) & (data["identifier"]==identifier)]
  return find_calibration_interval_for_subset(subset, risk_factor)


def find_calibration_interval_for_all(data, risk_factor):
    def find_calibration_interval_for_subset_helper(subset):
        return find_calibration_interval_for_subset(subset, risk_factor)
    res = data.groupby(["serial_number", "identifier"]).apply(find_calibration_interval_for_subset_helper)
    res = pd.DataFrame(res, columns=["calibration interval (years)"])
    return res


# תעודת כיול
# write_calibration_certificate

def write_calibration_certificate(data, serial_number, identifier):

  this_data = data[(data['serial_number']==serial_number) & (data["identifier"]==identifier)]
  certificate_data = []
  for query_value in this_data["input_value"].unique():
    linear_reg_results = calibration_for_subset(this_data[this_data["input_value"]==query_value])
    today_date_value = (datetime.today()-min(this_data["measurement_date"])).days / 365 + 1
    uncertainty_results = predict_uncertainty(data=data, serial_number=serial_number, identifier=identifier, query_date=datetime.today(), query_value=query_value, k=5)
    unc = uncertainty_results['uncertainty_extended_prediction']
    a, b = linear_reg_results["a"], linear_reg_results["b"]
    predicted_deviation = a + b*today_date_value
    predicted_output = query_value + predicted_deviation
    certificate_data.append({"input": query_value, "output": predicted_output,
                             "deviation": predicted_deviation, "unc": unc})

  calibration_certificate = pd.DataFrame(certificate_data)
  return calibration_certificate

# חיזוי value שלא קיים
# predict_for_nonexistent_input_value - return data for canvas

def predict_for_nonexistent_input_value(data, serial_number, identifier, query_date, query_input_value,  k=6, to_plot=False):
  this_data = data[(data['serial_number']==serial_number) & (data["identifier"]==identifier)]
  input_values_data = []
  for input_value in this_data["input_value"].unique():
    linear_reg_results = calibration_for_subset(this_data[this_data["input_value"]==input_value])
    a, b = linear_reg_results["a"], linear_reg_results["b"]
    if not isinstance(query_date, datetime):
        query_date = datetime.strptime(query_date, "%d/%m/%Y")
    query_date_value = (datetime.today()-min(this_data["measurement_date"])).days / 365 + 1
    predicted_deviation = a + b*query_date_value
    uncertainty_results = predict_uncertainty(data=data, serial_number=serial_number, identifier=identifier, query_date=query_date, query_value=input_value, k=k)
    unc_standard = uncertainty_results["u_predStandard"]
    this_input_value_data = {"x": input_value, "deviation": predicted_deviation, "unc_standard": unc_standard}
    input_values_data.append(this_input_value_data)
  input_values_data = pd.DataFrame(input_values_data)
  input_values_data["w"] = 1/input_values_data["unc_standard"]**2

  S0 = sum(input_values_data["w"])
  S1 = sum(input_values_data["w"]*input_values_data["x"])
  S2 = sum(input_values_data["w"]*input_values_data["x"]**2)
  S3 = sum(input_values_data["w"]*input_values_data["x"]**3)
  S4 = sum(input_values_data["w"]*input_values_data["x"]**4)
  T0 = sum(input_values_data["w"]*input_values_data["deviation"])
  T1 = sum(input_values_data["w"]*input_values_data["deviation"]*input_values_data["x"])
  T2 = sum(input_values_data["w"]*input_values_data["deviation"]*input_values_data["x"]**2)

  M = np.array([[S0, S1, S2], [S1, S2, S3], [S2, S3, S4]])
  B = np.array([T0, T1, T2])
  X = np.linalg.solve(M, B)
  a, b, c = X
  predicted_deviation = a + b*query_input_value + c*query_input_value**2

  if to_plot:

      x = input_values_data["x"]
      y_true = input_values_data["deviation"]

      x_new = query_input_value  # <-- replace with your actual value
      y_new_pred = a + b * x_new + c * x_new ** 2

      # Step 3: Plot
      plt.figure(figsize=(10, 6))

      # Known points
      plt.scatter(x, y_true, label='Ground Truth', color="blue")
      x_range = np.arange(min(x), max(x), 0.1)
      y_range_fit = a + b*x_range + c*x_range**2
      plt.plot(x_range, y_range_fit, label='Quadratic fit', color="green")

      # New/unseen point
      plt.scatter(x_new, y_new_pred, color='red', s=100, marker='*', label='Prediction for New Input')

      # Labels and grid
      plt.xlabel('Input Value')
      plt.ylabel('Output / Deviation')
      plt.title('Ground Truth vs. Predicted (with New Input Prediction)')
      plt.legend()
      plt.grid(True)
      plt.tight_layout()
      plt.savefig(f"quadratic_fit_{serial_number}_{identifier}_{query_date.date()}_{query_input_value}.png")
      plt.close()

  return predicted_deviation

def remove_last_measurement_by_date(data, serial_number, identifier):
    """Removes the last measurement (by date) for each input value within a subset of data.

    Args:
        data: The DataFrame containing all the measurement data.
        serial_number: The serial number to filter on.
        identifier: The identifier to filter on.

    Returns:
        DataFrame: The filtered DataFrame with the last measurement for each input value removed.
    """
    filtered_data = data[(data['serial_number'] == serial_number) & (data['identifier'] == identifier)]

    # Sort by date to ensure we're getting the last measurement by date
    filtered_data = filtered_data.sort_values(by=['date_value'])

    # Group by 'input_value' and drop the last row of each group
    filtered_data = filtered_data.groupby('input_value', group_keys=True).apply(lambda x: x.iloc[:-1]).reset_index(drop=True)

    return filtered_data

def compare_deviations_uncertainties(data, serial_number, identifier, k=6):
    """Compares predicted and real deviations against their combined uncertainties.

    Args:
        data: The DataFrame containing all the measurement data.
        serial_number: The serial number to filter on.
        identifier: The identifier to filter on.
        k: Number of nearest neighbors to consider for uncertainty prediction (default=6).

    Returns:
        DataFrame: A DataFrame containing input values, real deviations, predicted deviations,
                   combined uncertainties, and the comparison result.
    """
    filtered_data = remove_last_measurement_by_date(data, serial_number, identifier)
    results = []

    all_subset_all_input_values = data[(data['serial_number'] == serial_number) & (data['identifier'] == identifier)]


    if filtered_data.empty:
      print(f"cannot apply LOO validation for serial number: {serial_number}, identifier: {identifier}, since have only <= 1 time points")
      return pd.DataFrame()

    for input_value in filtered_data['input_value'].unique():

        # Get data for the current input value, including the last measurement:
        all_subset = all_subset_all_input_values[(all_subset_all_input_values['input_value'] == input_value)]
        all_subset = all_subset.sort_values(by=["date_value"]) # sort by dates

        # Filter to exclude the last measurement (for recalculating linear regression):
        subset = all_subset.iloc[:-1]

        if len(subset) <= 1:
          print(f"cannot apply LOO validation for serial number: {serial_number}, identifier: {identifier}, input value: {input_value}, since have only <= 2 time points")
          results.append({
            'input_value': input_value,
            "slope": np.nan,
            "intercept": np.nan,
            'real_deviation': np.nan,
            'predicted_deviation': np.nan,
            "real_uncertainty": np.nan,
            "predicted_uncertainty": np.nan,
            'En': np.nan,
            'comparison_to_1': np.nan
            })
          continue


        # Get the last date value and real deviation before removal:
        last_date = all_subset["measurement_date"].iloc[-1]
        last_date_value = all_subset["date_value"].iloc[-1]
        real_deviation = all_subset['deviation'].iloc[-1]

        # Recalculate linear regression after removing last measurement
        linear_reg_results = calibration_for_subset(subset)
        a, b = linear_reg_results["a"], linear_reg_results["b"]

        predicted_deviation = a + b * last_date_value

        uncertainty_results = predict_uncertainty(filtered_data, serial_number, identifier, last_date, input_value, k)
        uncertainty_predicted = uncertainty_results['uncertainty_extended_prediction']
        uncertainty_real = all_subset['uncertainty'].iloc[-1] # also using the complete subset
        combined_uncertainty = np.sqrt(uncertainty_real**2 + uncertainty_predicted**2)
        statistic = abs(predicted_deviation - real_deviation) / combined_uncertainty
        comparison = float(statistic < 1)
        results.append({
            'input_value': input_value,
            "slope": b,
            "intercept": a,
            'real_deviation': real_deviation,
            'predicted_deviation': predicted_deviation,
            "real_uncertainty": uncertainty_real,
            "predicted_uncertainty": uncertainty_predicted,
            'En': statistic,
            'comparison_to_1': comparison
        })
    return pd.DataFrame(results)

def percentage_pass_deviation_uncertainty_validation(data, serial_number, identifier, k=6):
  #print(f"called with {serial_number} and {identifier}")
  subset = data[(data["serial_number"]==serial_number) & (data["identifier"]==identifier)]
  #print(subset)
  input_values = subset["input_value"].unique()
  input_values.sort()  # Sort input values in ascending order
  input_values_counts = subset['input_value'].value_counts().loc[input_values].tolist()
  value2counts = {value: count for value, count in zip(input_values, input_values_counts)}


  results = compare_deviations_uncertainties(data, serial_number, identifier, k)
  try:
    if results.empty:
      print(f"cannot estimate LOO percentage pass for serial number: {serial_number} and identifier: {identifier} since LOO not applicable for any of its input values")
      return value2counts, np.nan
    return value2counts, 100 * float(results["comparison_to_1"].mean())
  except Exception as e:
    print(e.with_traceback())
    print(results)


def apply_validation_all_combinations(data, k=6):
    """Applies percentage_pass_deviation_uncertainty_validation to all combinations
    of serial number and identifier using groupby and apply.

    Args:
        data: The DataFrame containing all the measurement data.
        k: Number of nearest neighbors to consider for uncertainty prediction (default=6).

    Returns:
        DataFrame: A DataFrame containing the percentage pass rate for each
                   serial number and identifier combination.
    """

    def validation_wrapper(group):
        serial_number = group['serial_number'].iloc[0]
        identifier = group['identifier'].iloc[0]
        if identifier is not np.nan:
            value2counts, percentage_pass = percentage_pass_deviation_uncertainty_validation(data, serial_number, identifier, k)

            return pd.DataFrame({"input values and their counts": [value2counts], 'percentage_pass': [percentage_pass]}, index=[(serial_number, identifier)])
        else:
            return pd.DataFrame()

    results = data.groupby(['serial_number', 'identifier'], dropna=True).apply(validation_wrapper) # dropna to remove null identifiers
    results = results.droplevel(2, axis=0)  # Remove unnecessary multi-index level

    return results

def summarize_input_values(data):
    """
    Summarizes input values for each serial number and identifier.

    Args:
        data: The input DataFrame.

    Returns:
        DataFrame: A DataFrame indexed by serial number and identifier, with
                   columns for input values (sorted) and their counts.
    """

    def get_input_data(group):
        input_values = group['input_value'].unique()
        input_values.sort()  # Sort input values in ascending order
        input_values_counts = group['input_value'].value_counts().loc[input_values].tolist()
        value2counts = {value: count for value, count in zip(input_values, input_values_counts)}
        return pd.Series({'input values and theirs counts': value2counts})

    result = data.groupby(['serial_number', 'identifier']).apply(get_input_data).reset_index()
    result = result.set_index(['serial_number', 'identifier'])

    return result

# def calibration_tool(data):
#     """
#     Switches between calibration interval and certificate based on user input,
#     with separate input validation for each parameter.

#     Args:
#         data: The DataFrame containing all the measurement data.

#     Returns:
#         None (Prints the results)
#     """

#     while True:
#         choice = input("Enter 1 for calibration certificate, 2 for finding interval, or 'q' to quit: ")

#         if choice == '1':  # Calibration Certificate
#             while True:
#                 serial_number = input("Enter serial number: ")
#                 if not (data['serial_number'] == serial_number).any():
#                     print("Invalid serial number. Please try again.")
#                     continue  # Go back to the beginning of the loop

#                 identifier = input("Enter identifier: ")
#                 if not (data['identifier'] == identifier).any() and False:
#                     print("Invalid identifier. Please try again.")
#                     continue  # Go back to the beginning of the loop

#                 print("Calibration Certificate:")
#                 print(write_calibration_certificate(data, serial_number, identifier))
#                 break  # Exit the inner loop

#         elif choice == '2':  # Calibration Interval
#             while True:
#                 serial_number = input("Enter serial number: ")
#                 if not (data['serial_number'] == serial_number).any():
#                     print("Invalid serial number. Please try again.")
#                     continue  # Go back to the beginning of the loop

#                 identifier = input("Enter identifier: ")
#                 if not (data['identifier'] == identifier).any():
#                     print("Invalid identifier. Please try again.")
#                     continue  # Go back to the beginning of the loop

#                 try:
#                     risk_factor = float(input("Enter risk factor (a number): "))
#                 except ValueError:
#                     print("Invalid risk factor. Please enter a number.")
#                     continue  # Go back to the beginning of the loop

#                 interval = find_calibration_interval(data, serial_number, identifier, risk_factor)
#                 print(f"Calibration interval (years): {interval}")
#                 break  # Exit the inner loop

#         elif choice.lower() == 'q':
#             break  # Exit the main loop

#         else:
#             print("Invalid choice. Please enter 1, 2, or 'q'.")

# def merge_with_amit_example_data(data):
#     # merging with example data from Amit - can ignore that
#     example_data = pd.read_excel("Calibration Interval Exmple for Caliper update.xlsx", skiprows=2, nrows=20)
#     example_data = example_data[
#         ["Date:", "DateValue:", "Input", "Uncertainty", "IdString", "Deviation", "Tolerance"]].copy()
#     example_data.columns = ['measurement_date', "date_value", "input_value", "uncertainty", "identifier", "deviation",
#                             "tolerance"]
#     example_data["serial_number"] = "4-01"
#     example_data['measurement_date'] = pd.to_datetime(example_data['measurement_date'], dayfirst=True)
#     example_data.drop(["date_value"], axis=1, inplace=True)
#     data = pd.concat((example_data, data))
#     return data


def main(data_path):

    #read data - MUST
    data = pd.read_csv(data_path)

    # AFTER BUILDING WEBSITE< IGNORE THIS MERGE (it appears now because there are calls on merged data)
    data = merge_with_amit_example_data(data)

    # preprocess - MUST
    data = preprocess_data(data)


    # POSSIBLE SCREEN: show data summary
    summarization = summarize_input_values(data)

    # POSSIBLE SCREEN: show the graph of linear regression of deviation for (serial number, input value)
    # the graph will be saved at the same directory under lin_reg_serial_number={serial_number}_input_value={input_value}.png
    # calculate statistics (slope, intercept and stastical measurement) for linear regression of deviation on time, for specific subset
    # optional: plot the graph of data and best fit line
    statistics = calibration(data, serial_number="4-02", input_value=37.9, to_plot=True)

    # calcukate for all subsets in data
    # POSSIBLE SCREEN: show this table (indexed by serial number and input value, with many stastical quantities for the lin reg performed on them)
    results_linear = apply_calibration_for_all(data)

    query_date = "21/04/2025" # date string should be in format "%d/%m/%Y"
    query_value = 20
    # POSSIBLE SCREEN: show this table for all
    res_uncertinty = predict_uncertainty_for_all(data, query_date, query_value, k=6)


    # calculate calibration interval and calibration certificate for speicific subset
    identifier = 'Outside Measurment'
    serial_number = "4-01"
    print("calibration interval (years)")
    calibration_interval = find_calibration_interval(data, serial_number, identifier, risk_factor=0)
    print(calibration_interval)
    print("calibration certificate:")
    #POSSIBLE SCREEN: show calibration certificate
    print(write_calibration_certificate(data, serial_number, identifier))

    # POSSIBLE SCREEN: calculate calibration interval for all subsets
    results_calibration_intervals = find_calibration_interval_for_all(data, risk_factor=0) #todo debug values

    # validation of the progress:
    # remove last measurement from each subset.
    # predict its deviation using linear regression (calibration) on the first measurements.
    # check that the distance (abs val) between predicted and true deviation is insignificant relative to the uncertainty
    # (where uncertainty is ground truth and predicted combined)

    # POSSIBLE SCREEN: show validation of the progress
    val = apply_validation_all_combinations(data, k=4)

    serial_number = "00226"
    identifier = "not provided"
    # POSSIBLE SCREEN: show prediction of devation for input values not in the data
    # it's doen by quadratic fit to the existingn values
    res = predict_for_nonexistent_input_value(data, serial_number, identifier, query_date, query_input_value=68, k=6, to_plot=True)

if __name__ == "__main__":
    data_path = "data.csv"
    # code to execute when the script is run directly
    main(data_path)

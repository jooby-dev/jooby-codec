# Command: SET_TIME_2000

## Description

Time setting command.
Sent to the sensor to set the time.


## Request

### Parameters

 Name      | Description
-----------|-------------
 TIME_SEQ  | Some sequence? Must be different from the same parameter in the TIME_2000 command sent from the sensor. This is done to avoid double processing of the command. The new sensor time will equal the current sensor time plus the value passed in the SET_TIME_2000 command.
 TIME_2000 | Seconds since year 2000. The TIME_2000[4] parameter in the command is signed. The sensor sends a response to the command.

Format:

<table>
    <thead>
        <tr>
            <th>7</th>
            <th>6</th>
            <th>5</th>
            <th>4</th>
            <th>3</th>
            <th>2</th>
            <th>1</th>
            <th>0</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td colspan="5" align="center">CMD_ID = 0x02</td>
        </tr>
        <tr>
            <td colspan="8" align="center">CMD_LENGTH = 5</td>
        </tr>
        <tr>
            <td colspan="8" align="center">TIME_SEQ</td>
        </tr>
        <tr>
            <td colspan="8" align="center">TIME_2000[3]</td>
        </tr>
        <tr>
            <td colspan="8" align="center">TIME_2000[2]</td>
        </tr>
        <tr>
            <td colspan="8" align="center">TIME_2000[1]</td>
        </tr>
        <tr>
            <td colspan="8" align="center">TIME_2000[0]</td>
        </tr>
    </tbody>
</table>

Example:

    TIME_SEQ: 78
    TIME_2000: 123456
    HEX: 02 05 4e 00 01 e2 40


## Response

Format:

<table>
    <thead>
        <tr>
            <th>7</th>
            <th>6</th>
            <th>5</th>
            <th>4</th>
            <th>3</th>
            <th>2</th>
            <th>1</th>
            <th>0</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td colspan="5" align="center">CMD_ID = 0x02</td>
        </tr>
        <tr>
            <td colspan="8" align="center">CMD_LENGTH = 1</td>
        </tr>
        <tr>
            <td colspan="8" align="center">STATUS</td>
        </tr>
    </tbody>
</table>

### Parameters

 Name   | Description
--------|-------------
 STATUS | `1` - the time setting was successful <br> `0` - time setting failed (the TIME_SEQ parameter was not changed)
